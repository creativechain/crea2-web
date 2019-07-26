<?php
/**
 * Created by PhpStorm.
 * User: ander
 * Date: 27/03/19
 * Time: 13:05
 */

namespace Creary;

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

class ViewRender
{

    /**
     * @var \Twig\Environment
     */
    private $twig;

    /**
     * Render constructor.
     * @param string $templatesDir
     * @param array $options
     */
    public function __construct(string $templatesDir = __DIR__ . '/../views', array $options = array())
    {
        $loader = new FilesystemLoader($templatesDir);
        $this->twig = new Environment($loader, $options);
    }

    /**
     * @param string $view
     * @param array $context
     * @return string
     * @throws \Twig\Error\LoaderError
     * @throws \Twig\Error\RuntimeError
     * @throws \Twig\Error\SyntaxError
     */
    public function render(string $view, array $context = array()) {
        return $this->twig->render($view, $context);
    }
}