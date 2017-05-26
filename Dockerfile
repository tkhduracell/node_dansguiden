FROM node:6.4

RUN mkdir -p /app

WORKDIR /app

ENV NODE_ENV production

COPY package.json .

RUN npm install --$NODE_ENV

COPY 404/ .

COPY public/ ./public
COPY routes/ ./routes
COPY views/ ./views
COPY jobs/ ./jobs
COPY bin/ ./bin
COPY app.js .
COPY newrelic.js .

CMD ["bash", "-c", "./bin/www"]

ENV NODE_PORT 6000
ENV NODE_LOGGER default
