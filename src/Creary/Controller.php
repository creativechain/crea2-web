<?php
/**
 * Created by PhpStorm.
 * User: ander
 * Date: 27/03/19
 * Time: 23:01
 */

namespace Creary;

class Controller
{

    /**
     * @var ViewRender
     */
    private $viewRender;

    /**
     * @var Router
     */
    private $router;

    /**
     * @var array
     */
    private $callMap;

    /**
     * Controller constructor.
     * @param ViewRender $viewRender
     * @param Router $router
     */
    public function __construct(ViewRender $viewRender, Router $router)
    {
        $this->viewRender = $viewRender;
        $this->router = $router;
        $this->callMap = array();
    }

    /**
     * @param string $route
     * @param string $view
     * @param string|null $callMethod
     */
    public function addRoute(string $route, string $view, string $callMethod = null) {
        $this->router->addRoute($route, $view);

        if ($callMethod) {
            $this->callMap[$route] = array(
                'view' => $view,
                'method' => $callMethod
            );
        }
    }

    /**
     * @return CrearyClient
     */
    private function getCrearyClient() {
        return new CrearyClient();
    }

    /**
     * @return string
     * @throws \Twig\Error\LoaderError
     * @throws \Twig\Error\RuntimeError
     * @throws \Twig\Error\SyntaxError
     * @throws \Exception
     */
    public function handle() {
        $requestUri = $_SERVER['REQUEST_URI'];
        $view = $this->router->match($requestUri);
        $route = $this->router->getMatchedRoute();

        if ($route && array_key_exists($route, $this->callMap)) {

            $func = $this->callMap[$route]['method'];
            return $this->{ $func }($view, $route, $requestUri);

        }

        $language = $this->getLanguage();
        return $this->viewRender->render($view, array(
            'lang' => $language
        ));
    }

    /**
     * @param string $url
     * @param string $title
     * @param string $description
     * @param string $image
     * @return array
     */
    private function buildOG($title, $description, $image, $url = null) {
        if (!$url) {
            $url = URLUtils::getFQDNUri();
        }

        return array (
            'url' => $url,
            'title' => $title,
            'image' => $image,
            'description' => $description
        );
    }

    /**
     * @param $cookie
     * @return mixed
     */
    private function getCookie($cookie) {
        if (array_key_exists($cookie, $_COOKIE)) {
            return $_COOKIE[$cookie];
        }

        return null;
    }

    /**
     * @return null
     * @throws \Exception
     */
    private function getProfileOfCookie() {
        $profileName = $this->getCookie('creary.username');

        if ($profileName) {
            $client = $this->getCrearyClient();
            $profile = $client->getAccount($profileName);

            return $profile;
        }

        return null;
    }

    /**
     * @return mixed
     * @throws \Exception
     */
    private function getLanguage() {
        $profile = $this->getProfileOfCookie();
        $lang = $this->getCookie('creary_language');
        $lang = $lang ? $lang : 'en';
        if ($profile) {
            $lang = $profile['metadata']['lang'];
        }

        return Lang::getLang($lang);
    }

    /**
     * @param string $view
     * @param string $route
     * @param string $requestUri
     * @return string
     * @throws \Exception
     */
    public function home($view, $route, $requestUri) {
        $language = $this->getLanguage();

        //die(print_r($language, true));
        $title =  ucfirst(URLUtils::splitRequestUri()) . ' - CREARY';
        return $this->viewRender->render($view, array(
            'lang' => $language,
            'og' => $this->buildOG($title, $language->METADATA->DESCRIPTION, $language->METADATA->IMAGE)
        ));
    }

    /**
     * @param string $view
     * @param string $route
     * @param string $requestUri
     * @return string
     * @throws \Exception
     */
    private function post($view, $route, $requestUri) {
        //Get author and permlink;
        $parts = explode('/', substr($requestUri, 1, strlen($requestUri)));

        $author = URLUtils::splitRequestUri();
        $permlink = URLUtils::splitRequestUri(1);
        if (substr($author, 0, 1) === '@') {
            //URL: /@author/permlink
            $author = substr($author, 1, strlen($author));
        } else {
            //URL: /category/@author/permlink
            $author = URLUtils::splitRequestUri(1);
            $author = substr($author, 1, strlen($author));
            $permlink = URLUtils::splitRequestUri(2);
        }

        $client = $this->getCrearyClient();
        $post = $client->getPost($author, $permlink);

        $language = $this->getLanguage();
        if ($post) {
            return $this->viewRender->render($view, array(
                'lang' => $language,
                'post' => $post,
                'og' => $this->buildOG($post['title'], $post['metadata']['description'], $post['metadata']['featuredImage']['url'])
            ));
        }

        return $this->viewRender->render($view);

    }

    /**
     * @param string $view
     * @param string $route
     * @param string $requestUri
     * @return string
     * @throws \Exception
     */
    private function profile($view, $route, $requestUri) {
        //Get author
        //Skip '/@' chars
        $profileName = URLUtils::splitRequestUri();
        $profileName = substr($profileName, 1, strlen($profileName));

        $client = $this->getCrearyClient();
        $profile = $client->getAccount($profileName);

        $language = $this->getLanguage();
        if ($profile) {
            $name = $profile['metadata']['publicName'] ? $profile['metadata']['publicName'] : $profile['name'];
            return $this->viewRender->render($view, array(
                'lang' => $language,
                'profile' => $profile,
                'og' => $this->buildOG($name, $profile['metadata']['about'], $profile['metadata']['avatar']['url'])
            ));
        }

        return $this->viewRender->render($view, array(
            'lang' => $language
        ));

    }
}