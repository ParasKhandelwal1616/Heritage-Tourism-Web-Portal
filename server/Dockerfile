FROM node:22-alpine

WORKDIR /clubapp

COPY  package*.json ./

RUN npm install

COPY . .

EXPOSE 5000


CMD [ "npm","start" ]

