import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / 'setup-toolbox.sh'


def fake_conda_script():
    return f'''#!{sys.executable}
import json
import os
import sys
with open(os.environ['CONDA_TEST_LOG'], 'a') as log:
    log.write(json.dumps(sys.argv[1:]) + '\\n')
if sys.argv[1:] == ['info', '--base']:
    print(os.environ['CONDA_TEST_BASE'])
elif sys.argv[1:] == ['env', 'list', '--json']:
    envs = [os.environ['CONDA_TEST_BASE']]
    if os.environ['CONDA_TEST_EXISTS'] == 'yes':
        envs.append(os.environ['CONDA_TEST_BASE'] + '/envs/esa-toolbox')
    print(json.dumps({{'envs': envs}}))
elif sys.argv[1] in ['create', 'install']:
    if os.environ['CONDA_TEST_FAIL'] == 'yes':
        sys.exit(17)
    open(os.environ['CONDA_TEST_READY'], 'w').close()
elif sys.argv[1] == 'run':
    if os.environ.get('CONDA_TEST_SOURCED') != 'yes':
        sys.exit(18)
    if os.environ['CONDA_TEST_REQUIREMENTS'] == 'missing' and not os.path.exists(os.environ['CONDA_TEST_READY']):
        sys.exit(1)
'''


class SetupToolboxTests(unittest.TestCase):
    def test_help_does_not_require_conda(self):
        result = subprocess.run(['/bin/bash', str(SCRIPT), '--help'], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0)
        self.assertIn('esa-toolbox', result.stdout)

    def test_invalid_arguments(self):
        result = subprocess.run(['/bin/bash', str(SCRIPT), '--unknown'], capture_output=True, text=True)
        self.assertEqual(result.returncode, 2)

    def run_with_fake_conda(self, existing=False, fail_install=False, requirements='ready'):
        with tempfile.TemporaryDirectory(prefix='toolbox setup ') as directory:
            root = Path(directory)
            base = root / 'conda base'
            (base / 'bin').mkdir(parents=True)
            (base / 'bin/python').symlink_to(sys.executable)
            (base / 'etc/profile.d').mkdir(parents=True)
            (base / 'etc/profile.d/conda.sh').write_text('export CONDA_TEST_SOURCED=yes\n')
            executable = root / 'conda'
            executable.write_text(fake_conda_script())
            executable.chmod(0o755)
            log = root / 'commands.jsonl'
            env = dict(os.environ, PATH=f'{root}{os.pathsep}{os.environ.get("PATH", "")}',
                       CONDA_TEST_LOG=str(log), CONDA_TEST_BASE=str(base),
                       CONDA_TEST_EXISTS='yes' if existing else 'no',
                       CONDA_TEST_FAIL='yes' if fail_install else 'no',
                       CONDA_TEST_REQUIREMENTS=requirements, CONDA_TEST_READY=str(root / 'ready'))
            result = subprocess.run(['/bin/bash', str(SCRIPT)], cwd=root, env=env,
                                    capture_output=True, text=True)
            calls = [json.loads(line) for line in log.read_text().splitlines()]
            return result, calls

    def test_creates_environment_from_another_working_directory(self):
        result, calls = self.run_with_fake_conda()
        self.assertEqual(result.returncode, 0, result.stderr)
        install = next(call for call in calls if call[0] == 'create')
        for argument in ['--name', 'esa-toolbox', 'python=3.13', 'esa-climate-toolbox',
                         'scikit-learn', '--override-channels', 'conda-forge']:
            self.assertIn(argument, install)
        self.assertTrue(any(call[0] == 'run' and 'list_operations' in call[-1] for call in calls))
        self.assertIn(str(SCRIPT.parent / 'audit-dataset-versions.py'), result.stdout)

    def test_rerun_skips_installed_dependencies(self):
        result, calls = self.run_with_fake_conda(existing=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertFalse(any(call[0] == 'install' for call in calls))
        self.assertFalse(any(call[0] == 'create' for call in calls))
        self.assertIn('skipping package installation', result.stdout)

    def test_installs_missing_dependencies_in_existing_environment(self):
        result, calls = self.run_with_fake_conda(existing=True, requirements='missing')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue(any(call[0] == 'install' for call in calls))
        self.assertFalse(any(call[0] == 'create' for call in calls))

    def test_install_failure_does_not_report_success(self):
        result, calls = self.run_with_fake_conda(fail_install=True)
        self.assertEqual(result.returncode, 17)
        self.assertNotIn('Setup complete', result.stdout)
        self.assertFalse(any(call[0] == 'run' for call in calls))

    def run_bootstrap(self, bad_checksum=False, downloader=True, existing_prefix=False):
        with tempfile.TemporaryDirectory(prefix='toolbox bootstrap ') as directory:
            root = Path(directory)
            bin_dir = root / 'commands'
            bin_dir.mkdir()
            # Isolate PATH so an installed Conda can never make the test bypass bootstrap.
            for name in ['dirname', 'mktemp', 'awk', 'rm', 'rmdir', 'mkdir', 'bash', 'cp', 'ln']:
                (bin_dir / name).symlink_to(shutil.which(name))
            checksum_tool = shutil.which('shasum') or shutil.which('sha256sum')
            (bin_dir / Path(checksum_tool).name).symlink_to(checksum_tool)
            uname = bin_dir / 'uname'
            uname.write_text('#!/bin/bash\nif [[ "$1" == "-s" ]]; then echo Linux; else echo x86_64; fi\n')
            uname.chmod(0o755)
            template = root / 'fake-conda'
            template.write_text(fake_conda_script())
            template.chmod(0o755)
            installer = root / 'fake-installer.sh'
            installer.write_text('''#!/bin/bash
set -eu
PREFIX="$3"
mkdir -p "$PREFIX/bin"
mkdir -p "$PREFIX/etc/profile.d"
echo 'export CONDA_TEST_SOURCED=yes' > "$PREFIX/etc/profile.d/conda.sh"
cp "$CONDA_TEST_TEMPLATE" "$PREFIX/bin/conda"
ln -s "$CONDA_TEST_PYTHON" "$PREFIX/bin/python"
''')
            if downloader:
                curl = bin_dir / 'curl'
                curl.write_text(f'''#!{sys.executable}
import hashlib
import os
from pathlib import Path
import sys
data = Path(os.environ['CONDA_TEST_INSTALLER']).read_bytes()
if sys.argv[-1].endswith('.sha256'):
    digest = '0' * 64 if os.environ['CONDA_TEST_BAD_CHECKSUM'] == 'yes' else hashlib.sha256(data).hexdigest()
    data = (digest + '  installer.sh\\n').encode()
Path(sys.argv[sys.argv.index('--output') + 1]).write_bytes(data)
''')
                curl.chmod(0o755)
            base = root / 'local miniforge'
            if existing_prefix:
                base.mkdir()
            env = dict(os.environ, PATH=str(bin_dir), TOOLBOX_CONDA_PREFIX=str(base),
                       CONDA_TEST_BASE=str(base), CONDA_TEST_TEMPLATE=str(template),
                       CONDA_TEST_INSTALLER=str(installer), CONDA_TEST_PYTHON=sys.executable,
                       CONDA_TEST_BAD_CHECKSUM='yes' if bad_checksum else 'no',
                       CONDA_TEST_LOG=str(root / 'log'), CONDA_TEST_EXISTS='no',
                       CONDA_TEST_FAIL='no', CONDA_TEST_REQUIREMENTS='ready',
                       CONDA_TEST_READY=str(root / 'ready'), TMPDIR=str(root))
            result = subprocess.run(['/bin/bash', str(SCRIPT)], cwd=root, env=env,
                                    capture_output=True, text=True)
            return result, (base / 'bin/conda').exists(), list(root.glob('esa-toolbox.*'))

    def test_bootstraps_conda_and_cleans_up_installer(self):
        result, installed, temporary_files = self.run_bootstrap()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue(installed)
        self.assertFalse(temporary_files)
        self.assertIn('source "', result.stdout)

    def test_rejects_installer_checksum_mismatch(self):
        result, installed, temporary_files = self.run_bootstrap(bad_checksum=True)
        self.assertEqual(result.returncode, 1)
        self.assertFalse(installed)
        self.assertFalse(temporary_files)
        self.assertIn('checksum verification failed', result.stderr)

    def test_missing_downloader_has_actionable_error(self):
        result, installed, _ = self.run_bootstrap(downloader=False)
        self.assertEqual(result.returncode, 1)
        self.assertFalse(installed)
        self.assertIn('Install curl or wget', result.stderr)

    def test_existing_prefix_is_not_overwritten(self):
        result, installed, _ = self.run_bootstrap(existing_prefix=True)
        self.assertEqual(result.returncode, 1)
        self.assertFalse(installed)
        self.assertIn('will not be overwritten', result.stderr)


if __name__ == '__main__':
    unittest.main()
