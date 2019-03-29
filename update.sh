#!/usr/bin/env bash

# Update sources
git pull origin test

# Update dependencies
composer update

# Clear twig cache
rm -rf var/twig_cache
