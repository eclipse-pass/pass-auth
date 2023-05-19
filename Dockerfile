FROM node:18.16-alpine3.17

WORKDIR "/usr/app"

COPY ./package.json ./

RUN yarn install
RUN yarn global add pm2

COPY . .
RUN yarn run tsc

EXPOSE 80 443

CMD ["pm2-runtime", "dist/app.js"]
