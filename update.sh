#!/usr/bin/env bash

UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
BASE=$(git merge-base @ "$UPSTREAM")

if [ $LOCAL = $REMOTE ]; then
    echo "Already up to date"
elif [ $LOCAL = $BASE ]; then
    # Need pull. Update sources
    git pull

    # Update dependencies
    composer update

    # Clear twig cache
    rm -rf var/twig_cache
fi

echo "${UPSTREAM}, ${LOCAL}, ${REMOTE}, ${BASE}"