"""Regression tests for Cloud SDK Python and directory-sync arguments."""

import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


PIPELINE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PIPELINE / 'dags'))

import task_factories


class UploadCommandTests(unittest.TestCase):
    def test_cloud_sdk_uses_supported_system_python(self):
        task = task_factories.gcloud_upload_dir('water_vapour', 'tcwv', '/workdir/water_vapour.tcwv/upload')
        self.assertEqual(task.env['CLOUDSDK_PYTHON'], '/usr/bin/python3')

    def test_rsync_receives_one_quoted_source_directory_and_one_destination(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / 'upload directory'
            source.mkdir()
            (source / 'metadata.json').write_text('{}')
            (source / 'tiles').mkdir()
            capture = root / 'args.json'
            gcloud = root / 'gcloud'
            gcloud.write_text('#!/bin/sh\nexit 0\n')
            gcloud.chmod(0o755)
            gsutil = root / 'gsutil'
            gsutil.write_text(
                '#!/usr/bin/env python3\n'
                'import json, os, sys\n'
                'with open(os.environ["CAPTURE"], "w") as f: json.dump(sys.argv[1:], f)\n'
            )
            gsutil.chmod(0o755)
            task = task_factories.gcloud_upload_dir('water_vapour', 'tcwv', str(source))
            destination = 'gs://esa-cfs-tiles/2.1.5/water_vapour.tcwv/'
            env = dict(os.environ, **task.env)
            env.update(PATH=str(root) + os.pathsep + os.environ['PATH'],
                       BUCKET=destination, KEY_FILE=str(root / 'key file.json'), CAPTURE=str(capture))
            subprocess.run(['bash', '-c', task.bash_command], env=env, check=True, capture_output=True)
            self.assertEqual(json.loads(capture.read_text()), [
                '-q', '-m', 'rsync', '-r', '-d', str(source), destination
            ])


if __name__ == '__main__':
    unittest.main()
