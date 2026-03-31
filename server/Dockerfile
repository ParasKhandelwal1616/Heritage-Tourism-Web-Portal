FROM node:22-alpine

WORKDIR /clubapp

COPY  package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD [ "npm","start" ]

