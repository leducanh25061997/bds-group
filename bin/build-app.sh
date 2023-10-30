#!/bin/sh -e

[ -f .env ] && . ./.env

[ -z "$DOCKER_IMAGE" ] && echo "DOCKER_IMAGE is required !" && exit 1

#VERSION=$(grep -oP 'v\d{1,}\.\d{1,}\.\d{1,}' ./.env)
#echo "[INFO] Current version: $VERSION"
#if [ ! -z "$VERSION" ]; then
#       DOCKER_IMAGE=$DOCKER_IMAGE.$VERSION
#       ESCAPED_VAL=$(printf '%s\n' "$DOCKER_IMAGE" | sed -e 's/[\/&]/\\&/g') && \
#        if [ ! -z "$ESCAPED_VAL" ]; then sed -i "s/^DOCKER_IMAGE=.*/DOCKER_IMAGE=$ESCAPED_VAL/" .env; echo "...replaced APP_IMAGE"; fi
#fi

echo "[INFO] DOCKER_IMAGE=$DOCKER_IMAGE"
echo "[INFO] $PWD"

bash bin/build-push.sh $DOCKER_IMAGE ./docker/Dockerfile .
