# This is the newer version

FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY .. .

ARG VITE_STRAPI_URL
ENV VITE_STRAPI_URL ${VITE_STRAPI_URL}

RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]
