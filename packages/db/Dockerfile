FROM node:8.5.0-alpine
ENV TINI_VERSION v0.16.1
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
RUN mkdir -p /db
WORKDIR /db
COPY package.json /db/package.json
# because #leveldb :$
RUN apk --no-cache add --update \
    python \
    python-dev \
    build-base \
    alpine-sdk
RUN npm install
COPY src/ /db/src
RUN npm run migrate
# CMD ["/tini", "--", "npm", "start", "--", "--host", "0.0.0.0"]
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
