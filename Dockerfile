FROM node:14

WORKDIR /my_backend/
COPY ./package.json /my_backend/
COPY ./yarn.lock /my_backend/
RUN yarn install

COPY . /my_backend/
RUN yarn build
CMD yarn start:dev