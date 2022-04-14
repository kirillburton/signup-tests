# signup-tests

This is a test assignment. 
Please note that this was my first experience using Cypress – seemed like a good idea to mix business with pleasure.

This suite is not fully configured for cross-browser testing because Cypress runner depends on browsers installed on user's machine.
In a fully controlled environment this is easy to configure. Do not suppose I haven't done that because I didn't thought of that.

[![Cypress Tests](https://github.com/kirillburton/signup-tests/workflows/Cypress%20Tests/badge.svg)](https://github.com/kirillburton/signup-tests/actions)

**Required to run**:
node v10.3+

**For a local run with headless browser**:
```
$ npm install
$ npm run test
```

**For a local run with a visible browser**:
```
$ npm install
$ $(npm bin)/cypress open
```
and run signup-tests.spec.js by clicking on it

**For a cloud run:**
see GitHub workflow "Cypress Tests" – create a pull request, add an empty commit


Tests code is [here](https://github.com/kirillburton/signup-tests/blob/main/tests/signup-tests.spec.js)
