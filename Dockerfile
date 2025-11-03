FROM node:20.11.1-alpine AS builder

RUN apk add --no-cache mongodb-tools curl tzdata

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn build

FROM node:20.11.1-alpine

RUN apk add --no-cache mongodb-tools curl

WORKDIR /app

COPY package*.json ./
RUN yarn install --production

RUN mkdir -p logs backup uploads && \
    chown -R node:node /app

COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV TZ=Asia/Ho_Chi_Minh

USER node

EXPOSE ${PORT}

CMD ["yarn", "start:prod"]