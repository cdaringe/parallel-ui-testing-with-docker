# db

this is the parallel-ui-test-with-docker database.

it is a [dummy database & database server](https://github.com/pouchdb/pouchdb-server) hosts information about popular programming languages.


## usage

- build
  - start docker
  - `npm run build`

- run
  - `docker run -it -p 5984:5984 dummy_db`
  - follow the onscreen instructions for entering into the db admin area

