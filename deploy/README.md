# Deployment / SSH

Helpers to connect to and deploy the SAT Solutions server.

## Files

- `.env.deploy.example` — template for connection settings. Copy to
  `.env.deploy` and fill in. **`.env.deploy` is gitignored — never commit
  real credentials.**
- `ssh_config.example` — an `~/.ssh/config` block for a `satsolutions-prod`
  host alias.
- `connect.sh` — open an interactive SSH session.
- `deploy.sh` — pull + build + migrate + restart on the server.

## Setup

```bash
cp deploy/.env.deploy.example deploy/.env.deploy
$EDITOR deploy/.env.deploy
chmod +x deploy/connect.sh deploy/deploy.sh
```

## Connect

```bash
./deploy/connect.sh
```

Or, using the SSH config alias:

```bash
cp deploy/ssh_config.example ~/.ssh/satsolutions_config
echo "Include ~/.ssh/satsolutions_config" >> ~/.ssh/config
ssh satsolutions-prod
```

## Deploy

```bash
./deploy/deploy.sh
```

## Authentication: use SSH keys, not passwords

Password auth is supported as a fallback (set `SSH_PASSWORD`, requires
`sshpass`), but **key-based auth is strongly recommended**. To switch:

```bash
# 1. Create a key if you don't have one
ssh-keygen -t ed25519 -C "satsolutions-deploy"

# 2. Copy the public key to the server (one-time, asks for the password)
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@ahost.uz

# 3. Set SSH_KEY in deploy/.env.deploy and leave SSH_PASSWORD empty
```

> Security note: if a server password was ever shared in plain text (chat,
> email, commit, etc.), rotate it: `ssh root@ahost.uz` then `passwd`.
