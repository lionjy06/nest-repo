FROM node:16

WORKDIR /rise_backend/
COPY ./package.json /rise_backend/
COPY ./yarn.lock /rise_backend/
RUN yarn install

COPY . /rise_backend/
RUN yarn build
CMD yarn start:dev