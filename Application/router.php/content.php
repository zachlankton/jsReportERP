<?php
    $method = $_SERVER['REQUEST_METHOD'];
    $realIP = $_SERVER['HTTP_X_REAL_IP'];
    $thisServerIP = $_SERVER['SERVER_ADDR'];
    
    $json = file_get_contents('php://input');
    $jData = [];
    $jData['data'] = [];
    $jData['data']['post_data'] = json_decode($json, true) ?: [];

    $uri = $_SERVER['REQUEST_URI'];
    $query_str = $_SERVER["QUERY_STRING"];
	$uri = str_replace($query_str, "", $uri);
	$uri = str_replace("?", "", $uri); //Remove "?" From URI;

    $cookies = ($_SERVER['HTTP_COOKIE']);

    if ($uri == "/") $uri = "/index";

    $jData['template'] = [ "name" =>  "/Application" . $uri ];
    //if ($method == "POST") { $jData['data'] = [ "post_data" => $_POST ]; }

    $json_data = json_encode($jData);

    $ch = curl_init( "http://".$thisServerIP.":5488/api/report?" . $query_str );

    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                                            'Content-Type: application/json',
                                            'Cookie: ' . $cookies,
                                            'Request-Method: ' . $method,
                                            'uri: '. $uri,
                                            'remote-ip: ' . $realIP
                                            )
    );

    curl_setopt($ch, CURLOPT_HEADERFUNCTION, function($curl, $header)
        {
            header($header);
            return strlen($header);
        }
    );
    curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($curl, $body)
        {
            echo $body;
            return strlen($body);
        }
    );

    # Setup request to send json via POST.
    curl_setopt( $ch, CURLOPT_POSTFIELDS, $json_data );
    
    # Send request.
    $result = curl_exec($ch);
    curl_close($ch);

?>
