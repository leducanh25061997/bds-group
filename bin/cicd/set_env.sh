#!/bin/sh -e

echo PROJECT_NAME=$PROJECT_NAME >> .env
echo STACK_NAME=$STACK_NAME >> .env
echo PROJECT_BASE_URL=$PROJECT_BASE_URL >> .env
echo PROJECT_ROOT=$PROJECT_ROOT >> .env
echo DOCKER_IMAGE=$DOCKER_IMAGE >> .env

