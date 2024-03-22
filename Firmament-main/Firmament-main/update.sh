#!/bin/sh
cd /home/singchun/Firmament
UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
BASE=$(git merge-base @ "$UPSTREAM")

if [ $LOCAL = $REMOTE ]; then
    echo "Up-to-date"
elif [ $LOCAL = $BASE ]; then
    echo "Need to pull"
    git pull
    run.sh
elif [ $REMOTE = $BASE ]; then
    echo "Need to push"
    git push
    run.sh
else
    echo "Diverged"
fi
