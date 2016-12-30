FROM node:6.4

RUN mkdir -p /app

WORKDIR /app

ENV NODE_ENV production
ENV NODE_PORT 6000

COPY package.json .

RUN npm install

COPY 404/ .
COPY jobs/ .
COPY public/ ./public
COPY routes/ ./routes
COPY views/ ./views
COPY app.js .
COPY newrelic.js .

EXPOSE 6000

CMD ['/usr/local/bin/nodejs', 'app.js']
