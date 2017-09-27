# e2e tests

this is the parallel-ui-test-with-docker e2e test suite.

it contains a test suite that generate a unique database instance for each test.

some tests also launch their own browser instances.  database metadata is injected into the browser so that the application can infer where to send its API requests to.

## usage

- run the ui with `REACT_APP_NODE_ENV=test`
- `npm test`

## context

- browser launches are coordinated by google's awesome [pupeteer](https://github.com/GoogleChrome/puppeteer/) library
- docker images are booted & destroyed with ease using [dockerode](https://github.com/apocas/dockerode)
- all testing code can be found in the `test/` dir!

