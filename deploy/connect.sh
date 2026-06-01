#!/usr/bin/env bash
#
# Open an interactive SSH session to the SAT Solutions server.
#
# Usage:
#   cp deploy/.env.deploy.example deploy/.env.deploy   # then edit it
#   ./deploy/connect.sh
#
# Auth: prefers SSH key (SSH_KEY). Falls back to password auth only if
# SSH_PASSWORD is set AND `sshpass` is installed (not recommended).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env.deploy"

if [[ -f "${ENV_FILE}" ]]; then
  # shellcheck disable=SC1090
  set -a; source "${ENV_FILE}"; set +a
fi

SSH_HOST="${SSH_HOST:?Set SSH_HOST in deploy/.env.deploy}"
SSH_USER="${SSH_USER:-root}"
SSH_PORT="${SSH_PORT:-22}"
SSH_KEY="${SSH_KEY:-}"
SSH_PASSWORD="${SSH_PASSWORD:-}"

ssh_opts=(-p "${SSH_PORT}" -o ServerAliveInterval=60)

if [[ -n "${SSH_KEY}" ]]; then
  ssh_opts+=(-i "${SSH_KEY}" -o IdentitiesOnly=yes)
fi

target="${SSH_USER}@${SSH_HOST}"

if [[ -n "${SSH_PASSWORD}" ]]; then
  if ! command -v sshpass >/dev/null 2>&1; then
    echo "ERROR: SSH_PASSWORD is set but 'sshpass' is not installed." >&2
    echo "Install it (e.g. 'brew install sshpass' / 'apt install sshpass')" >&2
    echo "or switch to SSH key auth (recommended)." >&2
    exit 1
  fi
  echo ">> Connecting to ${target} (password auth)…"
  exec sshpass -p "${SSH_PASSWORD}" ssh "${ssh_opts[@]}" "${target}"
fi

echo ">> Connecting to ${target} (key auth)…"
exec ssh "${ssh_opts[@]}" "${target}"
