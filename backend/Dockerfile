FROM node:20.12 AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY ./src ./src
RUN npm run build

FROM node:20.12-alpine AS production

COPY --from=build /app/dist ./dist
COPY package*.json ./

RUN npm install --omit=dev
CMD ["node", "dist/server.js"]