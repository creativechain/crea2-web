<?php

use Creary\Controller;
use Creary\Router;
use Creary\ViewRender;

require_once __DIR__ . '/../vendor/autoload.php';

$URI = $_SERVER['REQUEST_URI'];
$CONFIG_FILE = __DIR__ . '/../webconfig.json';
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
    global $CONFIG;
    $debug = $CONFIG['renderization']['debug'];
    $renderOptions = array(
        'debug' => $debug,
        'cache' => $debug ? false : __DIR__ .'/../var/twig_cache'
    );

    $controller = new Controller(new ViewRender(__DIR__ . '/views', $renderOptions), new Router());
    $controller->setDebugMode($debug);


    $controller->addRoute('/', 'home.php.twig');
    $controller->addRoute('^\/([\w\d\-\/]+)\/([\w\d\-\/]+)\/?$', 'home.php.twig'); // TAG PROJECTS
    $controller->addRoute('^\/(skyrockets|votes|responses|popular|promoted|cashout|payout|now|active)\/?$', 'home.php.twig'); //CATEGORIES
    $controller->addRoute('^\/(@[\w\.\d-]+)\/(feed)\/?$', 'home.php.twig');
    $controller->addRoute('^\/(@[\w\.\d-]+)\/?$', 'profile.php.twig', 'profile');
    $controller->addRoute('^\/(@[\w\.\d-]+)\/(projects|following|followers|curation-rewards|author-rewards|blocked|wallet|settings|passwords|balances|permissions)\/?$', 'profile.php.twig', 'profile');
    $controller->addRoute('^\/([\w\d\-\/]+)\/(\@[\w\d\.-]+)\/([\w\d-]+)\/?$', 'post-view.php.twig', 'post');
    $controller->addRoute('^\/(@[\w\d\.-]+)\/([\w\d-]+)\/?$', 'post-view.php.twig', 'post');
    $controller->addRoute('/search', 'home.php.twig');
    $controller->addRoute('/~witness', 'witnesses.php.twig');
    $controller->addRoute('/welcome', 'welcome.php.twig');
    $controller->addRoute('/validate', 'welcome.php.twig');
    $controller->addRoute('/publish', 'publish.php.twig');
    $controller->addRoute('/explore', 'explore.php.twig');
    $controller->addRoute('/~market', 'market.php.twig');
    //$controller->addRoute('/~calculator', 'vote_calculator.php.twig');
    //$controller->addRoute('/~calculator2', 'vote_calculator2.php.twig');
    $controller->addRoute('/faq', 'faq.php.twig');
    $controller->addRoute('/recover-account', 'recover-account.php.twig');
    $controller->addRoute('/terms_and_conditions', 'terms_and_conditions.php.twig');
    $controller->addRoute('/privacy_policy', 'privacy_policy.php.twig');
    $controller->addRoute('/404', 'errors/404.php.twig');
    $controller->addRoute('/503', 'errors/503.php.twig');
    $controller->addRoute('/~maintenance', 'errors/503.php.twig');


    echo $controller->handle();
}

if (loadConfig()) {
    error_log($URI);
    //die(print_r($CONFIG['maintenance'], true));
    if (strpos($URI, '/admin') === 0) {
        http_response_code(200);
        if ($CONFIG) {
            $REQUEST = receiveRequest();
            if (checkAuth()) {
                handleCommand($REQUEST['message']['text']);
            } else {
                error_log('No authorized!');
            }
        }

        echo 'Well';
    } else if (strpos($URI, '/~maintenance') === 0 && boolval($CONFIG['maintenance'])) {
        handleRoute();
    } else if (boolval($CONFIG['maintenance'])) {
        http_response_code(503);
        header('Location: https://' . $_SERVER['SERVER_NAME'] . '/~maintenance');
        die();
    } else {
        handleRoute();
    }
} else {
    handleRoute();
}


