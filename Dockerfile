# syntax=docker/dockerfile:1
FROM node:12-alpine
WORKDIR /
COPY . .
RUN npm install
CMD ["node", "server.js"]
EXPOSE 3001