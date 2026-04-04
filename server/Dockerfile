FROM node:22-alpine

WORKDIR /clubapp

COPY  package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000



CMD [ "npm","start" ]

