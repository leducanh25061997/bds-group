#!/bin/sh -e

[ -f .env ] && . ./.env

[ -z "$1" ] && echo "Please provide DOCKER_IMAGE_TAG (1st arg)" && exit 1

DOCKER_IMAGE_TAG=$1
DOCKERFILE_PATH=$2
DOCKER_CONTEXT_PATH=$3

echo "[INFO] Build & Push $DOCKER_IMAGE_TAG ..."
echo "[INFO] Current location: $PWD"
echo "[INFO] Context: $DOCKER_CONTEXT_PATH"
echo "[INFO] Dockerfile: $DOCKERFILE_PATH"
cat $DOCKERFILE_PATH

docker build -t $DOCKER_IMAGE_TAG -f $DOCKERFILE_PATH $DOCKER_CONTEXT_PATH && \
  docker push $DOCKER_IMAGE_TAG
