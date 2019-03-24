<?php
/**
 * Created by PhpStorm.
 * User: ander
 * Date: 6/03/19
 * Time: 10:20
 */

$p = $_GET['p'];
$author = explode('/', $p)[0];
$permlink = explode('/', $p)[1];

$data = array(
    'jsonrpc' => '2.0',
    'method' => 'tags_api.get_discussion',
    'params' => array(
        'author' => $author,
        'permlink' => $permlink,
    ),
    'id' => random_int(1, 99999999)
);

$data = json_encode($data);

$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL => "https://nodes.creary.net",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => $data,
    CURLOPT_HTTPHEADER => array(
        "Content-Type: application/json",
        "cache-control: no-cache"
    ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
    echo "cURL Error #:" . $err;
} else {
    //echo $response;
    $response = json_decode($response, true);

    if (array_key_exists('error', $response)) {
        echo $response['error']['message'];
    } else {
        $discussion = $response['result'];

        $id = intval($discussion['id']);

        $url = 'http://'. $_SERVER['HTTP_HOST'] . '/@' . $p;
        if ($id > 0) {
            //Valid permlink
            $metadata = json_decode($discussion['json_metadata'], true);
            $title = $discussion['title'];
            $description = $metadata['description'];
            $featuredImage = $metadata['featuredImage']['url'];

            echo "
                    <!doctype html>
                    <html lang=\"en\">
                    <head>
                        <meta charset=\"utf-8\">
                        <title>CREARY</title>
                        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">
                        <meta property=\"og:url\" content=\"$url\">
                        <meta property=\"og:type\" content=\"website\">
                        <meta property=\"og:title\" content=\"$title\">
                        <meta property=\"og:description\" content=\"$description\">
                        <meta property=\"og:image\" content=\"$featuredImage\">
                    </head>
                    <body>
                    
                    <script>
                    window.location.href = \"$url\";
                    </script>
                    </body>
                    </html>";

        } else {
            //redirect
            header('Location: '. $url);
            die();
        }

    }

}
