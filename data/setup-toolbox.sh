#!/usr/bin/env bash
# Set up the modern ESA Climate Toolbox for the data scripts (macOS/Linux).
set -euo pipefail

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  echo "Usage: bash data/setup-toolbox.sh"
  echo "Checks the 'esa-toolbox' environment and installs missing/incompatible requirements."
  echo "If Conda is missing, installs checksum-verified Miniforge locally (no sudo)."
  echo "Does not change shell configuration or activate the environment in your terminal."
  echo "TOOLBOX_CONDA_PREFIX overrides the local Miniforge installation directory."
  exit 0
fi
if [[ $# -ne 0 ]]; then
  echo "Unexpected arguments. Use --help for usage." >&2
  exit 2
fi

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ENV_NAME="esa-toolbox"
CONDA_PREFIX_LOCAL="${TOOLBOX_CONDA_PREFIX:-${XDG_DATA_HOME:-$HOME/.local/share}/esa-toolbox/miniforge3}"
# Pin the installer so its checksum asset belongs to the same release.
MINIFORGE_VERSION="26.7.2-0"
BOOTSTRAP_DIR=""

cleanup() {
  if [[ -n "$BOOTSTRAP_DIR" ]]; then
    rm -f -- "$BOOTSTRAP_DIR/installer.sh" "$BOOTSTRAP_DIR/installer.sh.sha256"
    rmdir "$BOOTSTRAP_DIR" 2>/dev/null || true
  fi
}
trap cleanup EXIT

download() {
  if command -v curl >/dev/null 2>&1; then
    curl --fail --location --retry 3 --output "$2" "$1"
  else
    wget --output-document="$2" "$1"
  fi
}

if command -v conda >/dev/null 2>&1; then
  CONDA_BIN="$(command -v conda)"
elif [[ -x "$CONDA_PREFIX_LOCAL/bin/conda" ]]; then
  CONDA_BIN="$CONDA_PREFIX_LOCAL/bin/conda"
else
  if ! command -v curl >/dev/null 2>&1 && ! command -v wget >/dev/null 2>&1; then
    echo "Install curl or wget with your OS package manager, then rerun setup." >&2
    exit 1
  fi
  if command -v shasum >/dev/null 2>&1; then
    CHECKSUM=(shasum -a 256)
  elif command -v sha256sum >/dev/null 2>&1; then
    CHECKSUM=(sha256sum)
  else
    echo "A SHA-256 verifier (shasum or sha256sum) is required to safely install Miniforge." >&2
    exit 1
  fi
  PLATFORM="$(uname -s)"
  ARCH="$(uname -m)"
  case "$PLATFORM/$ARCH" in
    Darwin/arm64|Darwin/x86_64) PLATFORM="MacOSX" ;;
    Linux/x86_64|Linux/aarch64) ;;
    Linux/arm64) ARCH="aarch64" ;;
    *) echo "Unsupported Miniforge platform: $PLATFORM/$ARCH" >&2; exit 1 ;;
  esac
  if [[ -e "$CONDA_PREFIX_LOCAL" ]]; then
    echo "Cannot install Miniforge: '$CONDA_PREFIX_LOCAL' exists but has no working bin/conda." >&2
    echo "Repair that installation or choose a different TOOLBOX_CONDA_PREFIX; it will not be overwritten." >&2
    exit 1
  fi
  BOOTSTRAP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/esa-toolbox.XXXXXX")"
  ASSET="Miniforge3-$MINIFORGE_VERSION-$PLATFORM-$ARCH.sh"
  URL="https://github.com/conda-forge/miniforge/releases/download/$MINIFORGE_VERSION/$ASSET"
  echo "Conda is missing. Downloading Miniforge $MINIFORGE_VERSION for $PLATFORM/$ARCH..."
  download "$URL" "$BOOTSTRAP_DIR/installer.sh"
  download "$URL.sha256" "$BOOTSTRAP_DIR/installer.sh.sha256"
  EXPECTED="$(awk 'NR == 1 {print $1}' "$BOOTSTRAP_DIR/installer.sh.sha256")"
  ACTUAL="$("${CHECKSUM[@]}" "$BOOTSTRAP_DIR/installer.sh" | awk '{print $1}')"
  if [[ ! "$EXPECTED" =~ ^[[:xdigit:]]{64}$ || "$ACTUAL" != "$EXPECTED" ]]; then
    echo "Miniforge checksum verification failed; refusing to execute the installer." >&2
    exit 1
  fi
  mkdir -p -- "$(dirname -- "$CONDA_PREFIX_LOCAL")"
  bash "$BOOTSTRAP_DIR/installer.sh" -b -p "$CONDA_PREFIX_LOCAL"
  CONDA_BIN="$CONDA_PREFIX_LOCAL/bin/conda"
fi

CONDA_BASE="$("$CONDA_BIN" info --base)"

# Load Conda for this setup process, including a newly bootstrapped installation.
# A child script cannot initialize its caller's shell; print this same command
# below so the user can also load Conda in their interactive terminal.
source "$CONDA_BASE/etc/profile.d/conda.sh"

# Use Conda's own Python, so no separate system Python is required for setup.
ENV_EXISTS="$("$CONDA_BIN" env list --json | "$CONDA_BASE/bin/python" -c '
import json
import os
import sys
envs = json.load(sys.stdin)["envs"]
print("yes" if any(os.path.basename(path.rstrip(os.sep)) == sys.argv[1] for path in envs) else "no")
' "$ENV_NAME")"

PACKAGES=("python=3.13" "esa-climate-toolbox" "scikit-learn")
CHANNELS=(--override-channels --channel conda-forge --strict-channel-priority)

# Python 3.13 supplies warnings.deprecated, used by Toolbox operations.
# scikit-learn is needed by those operations but is missing from some releases'
# dependency metadata. Conda handles GDAL and other native libraries together.
check_environment() {
  "$CONDA_BIN" run --no-capture-output --name "$ENV_NAME" python -c '
import sys
if sys.version_info[:2] != (3, 13):
    raise RuntimeError("Python 3.13 is required for this Toolbox environment.")
import esa_climate_toolbox
import sklearn
from osgeo import gdal
from xcube.core.store import new_data_store
from esa_climate_toolbox import ops
from esa_climate_toolbox.core import list_operations
operations = list_operations()
if not operations:
    raise RuntimeError("The Toolbox operations plugin did not register any operations.")
print("Python:", sys.version.split()[0])
print("ESA Climate Toolbox:", esa_climate_toolbox.__version__)
print("scikit-learn:", sklearn.__version__)
print("GDAL:", gdal.VersionInfo())
print("Registered operations:", len(operations))
'
}

if [[ "$ENV_EXISTS" == "yes" ]]; then
  echo "Checking the existing '$ENV_NAME' dependencies..."
  if check_environment >/dev/null 2>&1; then
    echo "All required dependencies are available; skipping package installation."
  else
    echo "Installing missing or incompatible dependencies in '$ENV_NAME'..."
    "$CONDA_BIN" install --yes --name "$ENV_NAME" "${CHANNELS[@]}" "${PACKAGES[@]}"
  fi
else
  echo "Creating the '$ENV_NAME' environment and installing dependencies..."
  "$CONDA_BIN" create --yes --name "$ENV_NAME" "${CHANNELS[@]}" "${PACKAGES[@]}"
fi

echo "Verifying the Toolbox installation (no climate-data downloads)..."
check_environment

echo
echo "Setup complete. Run these commands in your terminal:"
echo "  source \"$CONDA_BASE/etc/profile.d/conda.sh\""
echo "  conda activate $ENV_NAME"
echo "  python \"$SCRIPT_DIR/audit-dataset-versions.py\""
