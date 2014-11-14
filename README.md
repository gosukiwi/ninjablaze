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

 * Add more jutsu info in view panel
 * Implement trapped state, jutsu range and conditional jutsus (works only if trapped, or if the enemy used an x type jutsu, etc).
 * Turn timer, 1 minute seems fair for now
 * Homepage, with current games going on and stuff
 * Elemental damage?
 * More jutsus
 * Let users choose jutsus
 * Add OPTIONS button in game page, like hearthstone, so you can quit and stuff
 * Add something like Dodge? More mechanics, add a beforeturn action for venom procs and such.
 * Create some kind of configuration file
 * Emotes, like in Hearthstone
 * Add custom logger to log duel events, especially errors and such

# Techs used
 * Node
 * Express + Jade
 * Backbone (jQuery, Underscore)
 * Less
 * Gulp
 * Git
 * Bower
 * nginx + mysql
