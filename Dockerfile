FROM node:alpine

WORKDIR /data

COPY . .

RUN npm install

EXPOSE 8000

CMD ["node", "index.js"]
