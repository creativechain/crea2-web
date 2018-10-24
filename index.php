
<?php include 'home.php'
/*
include ('Router.php');

$router = new Router();

$router->addRoute('/\/([-a-zA-Z0-9.]+)\/@([-a-zA-Z0-9.]+)\/([-a-zA-Z0-9.]+)', array('filter', 'user', 'permlink'), 'post.php');
$router->addRoute('/\/([-a-zA-Z0-9.]+)', array('filter'), 'home.php');
$router->addRoute('/\/@([-a-zA-Z0-9.]+)', array('user'), 'profile.php');
$router->addRoute('/\/', array(), 'home.php');

$query = $_SERVER['REQUEST_URI'];
$file = $router->match($query);

if ($file) {
    ob_start();
    include $file;
    echo ob_get_clean();
} else {
    if (file_exists($query)) {
        echo file_get_contents($query);
    } else {
        echo '404 NOT FOUND: ' . $query;
    }

}*/
?>