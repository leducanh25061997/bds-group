# Declare the base image
FROM node:16.19.1-alpine
# Build step
# 1. copy package.json and package-lock.json to /app dir
RUN mkdir /app
COPY package*.json /app
# 2. Change working directory to newly created app dir
WORKDIR /app
RUN npm i -g serve
# 3 . Install dependencies
RUN yarn
# 4. Copy the source code to /app dir
COPY . .
RUN yarn build
# 6. Run the app
#CMD ["yarn", "start"]