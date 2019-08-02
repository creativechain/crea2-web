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
    public function addRoute(string $route, string $view, string $callMethod = 'home') {
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

    private function buildMeta($key, $keyValue, $content) {
        return array(
            'key' => $key,
            'keyValue' => $keyValue,
            'content' => $content
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
        $profileName = $this->getCookie('creary_username');
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

        if ($profile && array_key_exists('metadata', $profile) && array_key_exists('avatar', $profile['metadata'])) {
            $lang = $profile['metadata']['lang'];
        } else {
            $lang = $this->getCookie('creary_language');
            $lang = $lang ? $lang : 'en';
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

        $page = '/' .URLUtils::splitRequestUri();

        $pageMeta = $language->METADATA->{ $page };
        if (!$pageMeta) {
            $pageMeta = $language->METADATA->{ '/' };
        }

        $metas = array(
            $this->buildMeta('property', 'og:url', URLUtils::getFQDNUri()),
            $this->buildMeta('property', 'og:title', $pageMeta->TITLE),
            $this->buildMeta('property', 'og:image', $language->METADATA->IMAGE),
            $this->buildMeta('property', 'og:description', $pageMeta->DESCRIPTION),
            $this->buildMeta('property', 'og:type', 'website'),
            $this->buildMeta('name', 'twitter:card', 'summary_large_image'),
            $this->buildMeta('name', 'twitter:site', '@crearynet'),
            $this->buildMeta('name', 'twitter:title', $pageMeta->TITLE),
            $this->buildMeta('name', 'twitter:description', $pageMeta->DESCRIPTION),
            $this->buildMeta('name', 'twitter:image',$language->METADATA->IMAGE),
            $this->buildMeta('name', 'description', $pageMeta->DESCRIPTION),
        );

        return $this->viewRender->render($view, array(
            'lang' => $language,
            'metas' => $metas,
            'title' => $pageMeta->TITLE
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
            $authorName = $post['author']['metadata']['publicName'] ? $post['author']['metadata']['publicName'] : $author;
            $title = 'Creary - ' . $post['title'];
            $metas = array(
                $this->buildMeta('property', 'og:url', URLUtils::getFQDNUri()),
                $this->buildMeta('property', 'og:title', $title),
                $this->buildMeta('property', 'og:image', $post['metadata']['featuredImage']['url']),
                $this->buildMeta('property', 'og:description', $post['metadata']['description']),
                $this->buildMeta('property', 'og:type', 'article'),
                $this->buildMeta('property', 'article:published_time', $post['created']),
                $this->buildMeta('property', 'article:modified_time', $post['last_update']),
                $this->buildMeta('property', 'article:author', $authorName),
                $this->buildMeta('name', 'twitter:card', 'summary_large_image'),
                $this->buildMeta('name', 'twitter:site', '@Crearynet'),
                $this->buildMeta('name', 'twitter:creator', '@' . $author),
                $this->buildMeta('name', 'twitter:title', $title),
                $this->buildMeta('name', 'twitter:description', $post['metadata']['description']),
                $this->buildMeta('name', 'twitter:image', $post['metadata']['featuredImage']['url']),
                $this->buildMeta('name', 'description', $post['metadata']['description']),
            );

            $tags = $post['metadata']['tags'];
            if ($tags) {
                $metas[] = $this->buildMeta('name', 'keywords', implode(',', $tags));
                foreach ($tags as $t) {
                    $metas[] = $this->buildMeta('property', 'article:tag', $t);
                }
            }

            return $this->viewRender->render($view, array(
                'lang' => $language,
                'post' => $post,
                'metas' => $metas,
                'title' => $title
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
            $publicName = $profile['metadata']['publicName'];
            if ($publicName) {
                $title = 'Creary - ' . $publicName . ' (@' . $profileName . ')';
            } else {
                $title = 'Creary - @' . $profileName;
            }

            $metas = array(
                $this->buildMeta('property', 'og:url', URLUtils::getFQDNUri()),
                $this->buildMeta('property', 'og:title', $title),
                $this->buildMeta('property', 'og:image', $profile['metadata']['avatar']['url']),
                $this->buildMeta('property', 'og:description', $profile['metadata']['description']),
                $this->buildMeta('property', 'og:type', 'profile'),
                $this->buildMeta('property', 'profile:first_name', $publicName ? $publicName : $profileName),
                $this->buildMeta('property', 'profile:username', $profileName),
                $this->buildMeta('name', 'twitter:card', 'summary_large_image'),
                $this->buildMeta('name', 'twitter:site', '@Crearynet'),
                $this->buildMeta('name', 'twitter:creator', '@' . $profileName),
                $this->buildMeta('name', 'twitter:title', $title),
                $this->buildMeta('name', 'twitter:description', $profile['metadata']['description']),
                $this->buildMeta('name', 'twitter:image', $profile['metadata']['avatar']['url']),
                $this->buildMeta('name', 'description', $profile['metadata']['description']),
            );

            $tags = $profile['metadata']['tags'];
            if ($tags) {
                $metas[] = $this->buildMeta('name', 'keywords', implode(',', $tags));
            }

            return $this->viewRender->render($view, array(
                'lang' => $language,
                'profile' => $profile,
                'metas' => $metas,
                'title' => $title
            ));
        }

        return $this->viewRender->render($view, array(
            'lang' => $language
        ));

    }
}