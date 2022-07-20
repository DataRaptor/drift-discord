FROM node:16

EXPOSE 8080

WORKDIR /app

COPY . /app

RUN npm install --force --legacy-peer-deps


RUN npm run create-env

# build + start is currently throwing a strange 
# js exception on start, let's use ts-node for now
# before this hit's production it needs to compile properly
# to reduce startup times and performance (although ts-node)
# does some fancy caching to make dev performant...
#
# 
# RUN npm run build
# CMD ["npm", "run", "start"]

CMD ["npm", "run", "dev"]