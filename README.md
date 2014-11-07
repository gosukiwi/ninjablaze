# Ninja Blaze - Online Browser Strategy Game
Online browser game powered by Backbone, NodeJS, MySQL and nginx.
The documentation can be found in `doc/`.

# Developers
How to hack on Ninja Blaze:

 * If not already, run `npm install` and `bower install`.
 * Run `gulp` and do frontend work in `frontend/src/`.
 * `websockets` folder contains the "game server", WebSockets goodness.
 * `templates` contains the views used by Express.
 * `routes` contains the routes used by Express.
 * `helpers` is doubtful for now.
 * `lib` contains non-vendor libraries.

## TODO

 * Turn timer, 1 minute seems fair for now
 * Homepage, with current games going on and stuff
 * Elemental damage?
 * More jutsus
 * Let users choose jutsus
 * Add OPTIONS button in game page, like hearthstone, so you can quit and stuff
 * Add logging, mostly for the server events
 * Add something like Dodge? More mechanics, add a beforeturn action for venom procs and such.
