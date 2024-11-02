FROM node:20.12 AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY src ./src
RUN npm run build

FROM build AS test

WORKDIR /app
COPY --from=build /app/src ./src
COPY tsconfig.json ./tsconfig.json
COPY jest.config.js ./jest.config.js

CMD ["npm", "run", "test"]

FROM node:20.12-alpine AS run

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package*.json ./

RUN npm install --omit=dev
CMD ["node", "dist/server.js"]