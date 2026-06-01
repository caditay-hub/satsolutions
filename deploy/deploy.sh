#!/usr/bin/env bash
#
# Deploy SAT Solutions to the remote server over SSH.
#
# It connects to the server, pulls the configured branch, installs deps,
# builds all workspaces, runs DB migrations, and restarts the app.
#
# Usage:
#   cp deploy/.env.deploy.example deploy/.env.deploy   # then edit it
#   ./deploy/deploy.sh
#
# Assumes the repo is already cloned at REMOTE_PATH on the server and the
# process is managed by pm2 (adjust the restart command if you use systemd).

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
REMOTE_PATH="${REMOTE_PATH:?Set REMOTE_PATH in deploy/.env.deploy}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-master}"

ssh_opts=(-p "${SSH_PORT}" -o ServerAliveInterval=60)
[[ -n "${SSH_KEY}" ]] && ssh_opts+=(-i "${SSH_KEY}" -o IdentitiesOnly=yes)
target="${SSH_USER}@${SSH_HOST}"

# Commands run on the remote server.
read -r -d '' REMOTE_SCRIPT <<EOF || true
set -euo pipefail
cd "${REMOTE_PATH}"
echo ">> Fetching ${DEPLOY_BRANCH}…"
git fetch --all --prune
git checkout "${DEPLOY_BRANCH}"
git reset --hard "origin/${DEPLOY_BRANCH}"
echo ">> Installing dependencies…"
npm ci
echo ">> Building workspaces…"
npm run build
echo ">> Running migrations…"
npm run migrate -w @satsolutions/api
echo ">> Restarting app…"
pm2 reload satsolutions || pm2 start npm --name satsolutions -- run dev
echo ">> Deploy complete."
EOF

run_ssh() {
  if [[ -n "${SSH_PASSWORD}" ]]; then
    if ! command -v sshpass >/dev/null 2>&1; then
      echo "ERROR: SSH_PASSWORD set but 'sshpass' not installed." >&2
      exit 1
    fi
    sshpass -p "${SSH_PASSWORD}" ssh "${ssh_opts[@]}" "${target}" "bash -s"
  else
    ssh "${ssh_opts[@]}" "${target}" "bash -s"
  fi
}

echo ">> Deploying to ${target}:${REMOTE_PATH} (branch ${DEPLOY_BRANCH})…"
echo "${REMOTE_SCRIPT}" | run_ssh
