FROM node:14-alpine3.15

WORKDIR "/usr/app"

COPY ./package.json ./

RUN yarn install
RUN npm install pm2 -g

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 80 443

ENTRYPOINT ["./entrypoint.sh"]
