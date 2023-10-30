#!/bin/sh -e

[ -f .env ] && . ./.env

[ -z "$STACK_NAME" ] && echo 'STACK_NAME is required' && exit 1
[ -z "$PROJECT_ROOT" ] && echo 'PROJECT_ROOT required' && exit 1
[ -z "$SERVICE_NAME" ] && SERVICE_NAME=app

cd $PROJECT_ROOT

echo "[INFO] Deploying on branch:"
git status

if git pull; then
  #docker stack deploy -c<(docker-compose -f $PROJECT_ROOT/stack.dev.yml config) $STACK_NAME --with-registry-auth && \
  docker stack deploy -c $PROJECT_ROOT/stack.dev.yml $STACK_NAME --with-registry-auth && \
  bash bin/update-service $SERVICE_NAME && \
  echo "Done."
else
  echo "Error while pull code!"
  exit 1
fi
