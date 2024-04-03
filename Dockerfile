FROM node:latest

RUN mkdir -p /usr/node/app && \
    chown -R node:node /usr/node/app

WORKDIR /usr/node/app

USER node

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

CMD ["npm", "run", "start"]
