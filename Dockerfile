FROM node:18.16-alpine3.17

WORKDIR "/usr/app"

COPY ./package.json ./

RUN yarn install
RUN npm install pm2 -g
RUN pm2 install typescript

COPY . .

EXPOSE 80 443

CMD ["pm2-runtime", "src/app.ts"]
