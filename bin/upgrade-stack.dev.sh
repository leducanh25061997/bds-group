#!/bin/sh -e

echo ""
echo "[INFO] Usage: sh bin/upgrade-stack.dev.sh <git-branch-name>"
echo ""

[ ! -z "$1" ] && git checkout $1

git pull && \
 bash bin/build-app.sh && \
 bash bin/deploy-stack.dev.sh && sleep 5 && \
 bash bin/update-service app

