FROM node:16.13.1-alpine3.15 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16.13.1-alpine3.15
EXPOSE 80
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV PORT=80
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /usr/src/app/dist ./dist
CMD ["npm", "run", "start:prod"]