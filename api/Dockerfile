FROM node:16

EXPOSE 8080

WORKDIR /app

COPY . /app

RUN npm install 

RUN npm run build

RUN npm run create-env

CMD ["npm", "run", "start"]