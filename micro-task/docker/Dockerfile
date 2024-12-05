FROM node:22-alpine

RUN apk update && apk upgrade
RUN adduser -D -s /bin/bash -h /app api-prod
RUN chown -R api-prod /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PATH ./node_modules/.bin:$PATH
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm run build

EXPOSE 8080

USER api-prod

CMD ["npm", "run", "start:prod"]
