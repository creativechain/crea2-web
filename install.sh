#!/usr/bin/env bash

rm -rf var
rm -rf vendor

composer install

mkdir -p $PWD/var/twig_cache

echo "#######################################"
echo "#              ATTENTION              #"
echo "#     Your webserver index must be:   #"
echo "#             src/app.php             #"
echo "#######################################"