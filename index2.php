<?php

$URI = $_SERVER['REQUEST_URI'];
$CONFIG_FILE = 'webconfig.json';
$REQUEST = null;
$CONFIG = null;

function loadConfig() {
    global $CONFIG_FILE;
    if (file_exists($CONFIG_FILE)) {
        global $CONFIG;
        $CONFIG = file_get_contents($CONFIG_FILE);
        $CONFIG = json_decode($CONFIG, true);
        return $CONFIG;
    }

    return false;
}

function checkAuth() {
    $pathInfo = ltrim($_SERVER['REQUEST_URI'] ?? '', '/');
    global $CONFIG;
    global $REQUEST;
    if (explode('/', $pathInfo)[1] === $CONFIG['token']) {
        $username = $REQUEST['message']['from']['username'];

        error_log('User found' . array_search($username, $CONFIG['users']));
        return array_search($username, $CONFIG['users']) >= 0;

    } else {
        error_log('Token not match: ' .explode('/', $pathInfo)[1] . ' != ' . $CONFIG['token']);
    }

    return false;
}

function handleCommand($command) {
    global $CONFIG;
    global $CONFIG_FILE;
    error_log('Handling command: '. $command);
    if ($command === '/info') {
        sendMessage(json_encode($CONFIG, JSON_PRETTY_PRINT));
    } else if ($command === '/maintenance') {
        $maintenance = boolval($CONFIG['maintenance']);
        $CONFIG['maintenance'] = !$maintenance;
        $CONFIG_json = json_encode($CONFIG, JSON_PRETTY_PRINT);
        file_put_contents($CONFIG_FILE, $CONFIG_json);

        sendMessage('maintenance = ' . $CONFIG['maintenance']);
    }
}

function sendMessage($message) {
    global $CONFIG;
    global $REQUEST;
    $uri = $CONFIG['bot_url'] . $CONFIG['token'];
    $chatId = $REQUEST['message']['chat']['id'];
    $query = http_build_query([
        'chat_id' => $chatId,
        'text' => $message,
    ]);

    $response = file_get_contents("$uri/sendMessage?$query");
    return $response;
}

function receiveRequest()
{
    $json = file_get_contents("php://input");
    error_log($json);
    return json_decode($json, true);
}

function handleRoute() {
    require 'Router.php';
    $router = new Router();

    $router->addRoute('/', 'home.php');
    $router->addRoute('/search', 'home.php');
    $router->addRoute('/~witness', 'witnesses.php');
    $router->addRoute('/welcome', 'welcome.php');
    $router->addRoute('/validate', 'welcome.php');
    $router->addRoute('/publish', 'publish.php');
    $router->addRoute('/explore', 'explore.php');
    $router->addRoute('/exchange', 'exchange.php');
    #$router->addRoute('/~market', 'exchange.php');
    $router->addRoute('/faq', 'faq.php');
    $router->addRoute('/recover-account', 'recover-account.php');
    $router->addRoute('/terms_and_conditions', 'terms_and_conditions.php');
    $router->addRoute('/privacy_policy', 'privacy_policy.php');
    $router->addRoute('/404', '404.php');
    $router->addRoute('/503', '503.php');
    $router->addRoute('^\/(skyrockets|votes|responses|popular|popular30|promoted|cashout|payout|payout_comments|now|active)\/?$', 'home.php'); //CATEGORIES
    $router->addRoute('^\/([\w\d\-\/]+)\/([\w\d\-\/]+)\/?$', 'home.php'); // TAG PROJECTS
    $router->addRoute('^\/(@[\w\.\d-]+)\/(feed)\/?$', 'home.php');
    $router->addRoute('^\/(@[\w\.\d-]+)\/?$', 'profile.php');
    $router->addRoute('^\/(@[\w\.\d-]+)\/(projects|following|followers|curation-rewards|author-rewards|blocked|wallet|settings|passwords|balances|permissions)\/?$', 'profile.php');
    $router->addRoute('^\/([\w\d\-\/]+)\/(\@[\w\d\.-]+)\/([\w\d-]+)\/?$', 'post-view.php');
    $router->addRoute('^\/(@[\w\d\.-]+)\/([\w\d-]+)\/?$', 'post-view.php');

    include $router->match($_SERVER['REQUEST_URI']);
}

if (loadConfig()) {
    error_log($URI);
    //die(print_r($CONFIG['maintenance'], true));
    if (strpos($URI, '/admin') === 0) {
        http_response_code(200);
        if (loadConfig()) {
            if ($CONFIG) {
                $REQUEST = receiveRequest();
                if (checkAuth()) {
                    handleCommand($REQUEST['message']['text']);
                } else {
                    error_log('No authorized!');
                }
            }
        }

        echo 'Well';

    } else if (boolval($CONFIG['maintenance'])) {
        http_response_code(503);
        include '503.php';
    } else {
        handleRoute();
    }
} else {
    handleRoute();
}


