<?php
/**
 * Created by PhpStorm.
 * User: ander
 * Date: 28/03/19
 * Time: 10:49
 */

namespace Creary;


class URLUtils
{

    /**
     * @param int $index
     * @param string|null $requestUri
     * @return mixed
     */
    public static function splitRequestUri(int $index = 0, string $requestUri = null) {
        if (!$requestUri) {
            $requestUri = $_SERVER['REQUEST_URI'];
        }

        $parts = explode('/', substr($requestUri, 1, strlen($requestUri)));
        return $parts[$index];
    }

    /**
     * @return string
     */
    public static function getFQDNUri() {
        return 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    }
}