<?php

require_once __DIR__ . '/renderization/Render.php';

$render = new \ViewRender();

$render->render('test.php.twig', array(
   'title' => 'Twig engine works!',
   'body' => 'Testing Twig!!'
));
?>