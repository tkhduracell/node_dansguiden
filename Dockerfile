FROM node:8.2.1

RUN mkdir -p /app

WORKDIR /app

ENV NODE_ENV production
ENV NODE_MEMORY_LIMIT 512

COPY package.json .

RUN npm install --$NODE_ENV

COPY 404/ .

COPY public/ ./public
COPY routes/ ./routes
COPY views/ ./views
COPY bin/ ./bin
COPY lib/ ./lib
COPY app.js .
COPY newrelic.js .

RUN mkdir -p ./storage
RUN touch ./storage/dansguiden.db

CMD ["bash", "-c", "./bin/www"]

ENV NODE_PORT 6000
