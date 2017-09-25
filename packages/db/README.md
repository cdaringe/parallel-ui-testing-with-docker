# db

build a real, dummy database.

## usage

`npm run build`

this will build an image called `dummy_db` with some premigrated data.

you _could_ launch it with:

```sh
docker run -it -p 5984:5984 dummy_db
```

it's like couchdb, so you can query it w/ `curl`.  see couchdb docs for more.

