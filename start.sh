if [[ $1 == "dev" ]] ; then
    nodemon index.js
else
    forever --minUptime 1000 --spinSleepTime 1000 index.js
fi
