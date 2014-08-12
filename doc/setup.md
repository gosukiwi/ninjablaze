# Setting up Ninja Blaze
Ninja Blaze is powered by Node and MySQL, to run the app you need to have
**Node** installed, then just

    $ npm install
    $ bower install
    $ node index.js # start server

The database configuration for now it's at `index.js`, it might eventually move
to a single place where all the configuration will stand.

# Server setup
Only Node and MySQL is needed to run the app, but I run **nginx** as a reverse
proxy to cache assets, gzip output and overall goodness. It's tested on Ubuntu
14.04, so the server will most likely also be the same OS.

## Node setup
Right now I'm using [forever](https://github.com/nodejitsu/forever) to run the
script...forever. It's not on deployment yet so I'm not sure how I'll manage
that but I guess a little bash script should be enough to start the app when the
OS starts.

## MySQL Setup
The SQL needed to generate the schema is right now unavailable as it will change
quite a lot during development, it will eventually be on `doc/`.

