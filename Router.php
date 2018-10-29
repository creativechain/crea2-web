<?php

/**
 * Created by PhpStorm.
 * User: ander
 * Date: 23/10/18
 * Time: 21:45
 */
class Router
{
    /**
     * @var array
     */
    private $routes;

    public function __construct()
    {
        $this->routes = array();
    }

    /**
     * @param $route
     * @param $parts
     * @param $includeFile
     */
    public function addRoute($route, $parts, $includeFile) {
        $this->routes[] = array(
            'route' => $route,
            'parts' => $parts,
            'includeFile' => $includeFile
        );
    }

    /**
     * @param $route
     * @return string|null
     */
    public function match($route) {
        foreach ($this->routes as $r) {
            $matches = array();

            if ($r['route'] === $route) {
                error_log('Matched Route: s' . $r['route'] . ', url: ' . $route);
                return $r['includeFile'];
            } else if (preg_match_all($r['route']. '/m', $route, $matches, PREG_SET_ORDER, 0)) {
                error_log('Matched Route: s' . $r['route'] . ', url: ' . $route);
                return $r['includeFile'];
            }

        }

        return null;
    }
}