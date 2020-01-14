<?php  
    session_start();
    ini_set('display_errors', 'On');
    if(!empty($_REQUEST['submitHeader'])) {
        $text = $_REQUEST['EmailHeaderText'];
    }

    function pre_r($array) {
        echo '<pre>';
        print_r($array);
        echo '</pre>';
    }

    $text = file_get_contents("../header.txt");
    preg_match_all('/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/', $text, $ip_matches);
    pre_r($ip_matches);
    $tmp1 = array();
    $ip_matches = $ip_matches[0];
    $ip_matches = array_values(array_unique($ip_matches));

    // get all public IP addresses
    for ($i = 0; $i < count($ip_matches); $i++) {
        if (substr($ip_matches[$i],0,3) != "10." && 
            substr($ip_matches[$i],0,9) != "127.0.0.1" && 
            substr($ip_matches[$i],0,4) != "172." && 
            substr($ip_matches[$i],0, 7) != "192.168") {
            array_push($tmp1, $ip_matches[$i]);
        }
    }

    $ip_matches = array_values($tmp1);
    pre_r($ip_matches);

    $url = 'http://ip-api.com/json/';
    $tmp2 = array();
    for ($i = 0; $i < count($ip_matches); $i++) {
        $url = 'http://ip-api.com/json/'.$ip_matches[$i];
        //Use file_get_contents to GET the URL in question.
        $jason = file_get_contents($url);
        $jasonArray = json_decode($jason, true);
        array_push($tmp2, $jasonArray);
        //If $contents is not a boolean FALSE value.
        if($jason !== false){
            //Print out the contents.
        }
    }

    pre_r($tmp2);

?>  