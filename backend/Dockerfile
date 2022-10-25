FROM node:16-alpine

WORKDIR /workspace/
COPY ./package.json /workspace/
COPY ./yarn.lock /workspace/
RUN yarn install

COPY . /workspace/
CMD yarn start:dev