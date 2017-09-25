# env /bin/bash

# this hosed me: https://github.com/moby/moby/issues/6999
# SEE INSTEAD PACKAGE.JSON build script

set -e
printf 'purging old image & similarly named container\n'
docker rm -f dummy_db_builder || true
docker rmi -f dummy_db || true

printf '\nbooting base couchdb\n'
CONTAINER_ID=$(docker run -d --name dummy_db_builder -p 5984:5984 couchdb:latest)
sleep 2

printf '\ninspect:\n'
docker inspect $CONTAINER_ID

printf '\nrunning migrations\n'
# . src/migrations.sh
curl -X PUT http://127.0.0.1:5984/languages
curl -X POST -H 'Content-Type: application/json' http://127.0.0.1:5984/languages -d '{ "name": "javascript", "is": "easy" }'
curl -X POST -H 'Content-Type: application/json' http://127.0.0.1:5984/languages -d '{ "name": "erlang", "is": "interesting" }'
curl -X POST -H 'Content-Type: application/json' http://127.0.0.1:5984/languages -d '{ "name": "javascript", "is": "safe" }'

printf "\nmigration diff:\n"
docker container diff $CONTAINER_ID

printf "\nvalidate new tables"
curl http://localhost:5984/_all_dbs

printf "\ncommitting new image from $CONTAINER_ID"
docker commit $CONTAINER_ID concurrentdb
docker stop dummy_db_builder
