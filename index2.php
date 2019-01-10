<?php

if (false) {
    require 'Router.php';
    $router = new Router();

    $router->addRoute('/', 'home.php');
    $router->addRoute('/search', 'home.php');
    $router->addRoute('/~witness', 'witnesses.php');
    $router->addRoute('/welcome', 'welcome.php');
    $router->addRoute('/validate', 'welcome.php');
    $router->addRoute('/publish', 'publish.php');
    $router->addRoute('/explore', 'explore.php');
    $router->addRoute('/faq', 'faq.php');
    $router->addRoute('/recover-account', 'recover-account.php');
    $router->addRoute('/404', '404.php');
    $router->addRoute('/503', '503.php');
    $router->addRoute('^\/([\w\d\-\/]+)\/?$', 'home.php'); //
    $router->addRoute('^\/([\w\d\-\/]+)\/([\w\d\-\/]+)\/?$', 'home.php'); // TAG PROJECTS
    $router->addRoute('^\/(@[\w\.\d-]+)\/(feed)\/?$', 'home.php');
    $router->addRoute('^\/(@[\w\.\d-]+)\/?$', 'profile.php');
    $router->addRoute('^\/(@[\w\.\d-]+)\/(projects|following|followers|curation-rewards|author-rewards|blocked|wallet|settings|passwords|balances|permissions)\/?$', 'profile.php');
    $router->addRoute('^\/([\w\d\-\/]+)\/(\@[\w\d\.-]+)\/([\w\d-]+)\/?$', 'post-view.php');

    include $router->match($_SERVER['REQUEST_URI']);
} else {
    http_response_code(503);
    include '503.php';
}


