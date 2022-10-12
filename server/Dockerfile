FROM node:14-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]

RUN yarn

COPY . .

EXPOSE 8080

RUN chown -R node /usr/src/app

USER node

CMD ["yarn", "start"]
