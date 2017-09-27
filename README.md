# parallel ui testing with docker

this project shows a recipe for effective parallel end-to-end testing with docker.

the example presented uses a nodejs, react, couchdb/pouchdb, & docker stack.  the intent of the project is not to show or promote any of those tools, except docker.  regardless, i will highlight how some of these tools in this stack ease the game.

## problem

end-to-end (e2e) browser tests often change the supporting backend system state.

this includes, but is not limited to:

- databases
- session managers
- file systems

for instance, if your app has users, hopefull you've written an e2e test to add a user to the system.

however, with the states of these systems dirtied during testing, repeatability is often voided, and browser tests become flaky and/or complicated.

## solution

state resets.

docker makes trashing your old systems and bringing up a new pristine copies _easy_.

## example

we will execute a series of database tests and web application ui tests, where each test get's its own copy of the database.

this project houses:

- a database server image
- a web application
- a suite of e2e tests

let's see how these work together
## hurdles

- you must have a docker image that has your baseline data/files/etc ready to go
  - i generate such a hypothetical database
