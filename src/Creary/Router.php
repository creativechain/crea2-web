<?php

namespace Creary;
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

    /**
     * @var string
     */
    private $matchedRoute;

    public function __construct()
    {
        $this->routes = array();
    }

    /**
     * @param $route
     * @param $includeFile
     */
    public function addRoute($route, $includeFile) {
        $this->routes[] = array(
            'route' => $route,
            'includeFile' => $includeFile
        );
    }

    /**
     * @return string
     */
    public function getMatchedRoute()
    {
        return $this->matchedRoute;
    }


    /**
     * @param $route
     * @return string|null
     */
    public function match($route) {
        if (strpos($route, '/') === 0 && strlen($route) !== 1) {
            $route = rtrim($route, '/'); //Delete last slash
        }

        $route = strtok($route, '?');

        foreach ($this->routes as $r) {
            $matches = array();
            //error_log('Matching: ' . $r['route'] . ', url: ' . $route);

            if ($r['route'] === $route) {
                //error_log('Equal Route: ' . $r['route'] . ', url: ' . $route);
                $this->matchedRoute = $r['route'];
                return $r['includeFile'];
            } else if (preg_match('/'. $r['route']. '/', $route, $matches)) {

                $routeParts = explode('/', $route);
                array_splice($routeParts, 0, 1);

                $fullMatch = true;
                for ($x = 0; $x < count($routeParts); $x++) {
                    $part = $routeParts[$x];
                    $fullMatch = $fullMatch && in_array($part, $matches);

                    if (!$fullMatch ) {
                        break;
                    }
                }

                if ($fullMatch) {
                    //error_log('Matched Route: ' . $r['route'] . ', url: ' . $route);
                    $this->matchedRoute = $r['route'];
                    return $r['includeFile'];
                }
            }

        }

        $this->matchedRoute = null;
        return '404.php.twig';
    }
}