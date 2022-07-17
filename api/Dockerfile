FROM node:16

EXPOSE 8080

WORKDIR /app

COPY . /app

RUN npm install 

RUN npm run build

CMD ["npm", "run", "start"]