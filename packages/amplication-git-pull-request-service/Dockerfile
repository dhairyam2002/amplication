FROM node:18.12.1-alpine AS base

WORKDIR /app

RUN apk update \
    && apk add --no-cache git \
    && rm /var/cache/apk/*

RUN git config --global user.name "amplication" \
    && git config --global user.email "bot@amplication.com"

COPY ./dist/packages/amplication-git-pull-request-service/package.json .

RUN npm i --omit=dev

COPY ./dist/packages/amplication-git-pull-request-service .

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]