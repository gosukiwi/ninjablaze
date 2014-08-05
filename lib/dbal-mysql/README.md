# WIP MySQL DBAL for Node
Eventually, this will be an NPM package with tests and stuff :)

# Usage
You can simply `require('./lib/dbal-mysql/src/db)` or if you use **Express** you
can use the `middleware.js` file to easily use it in your app, you'll find the
dbal instance in `req.db` with a lazy connection so no worries if you don't use
your database often!

## Generate documentation
To build the docs just run `$ yuidoc`, YuiDoc will just read the configuration
from `yuidoc.json`.
