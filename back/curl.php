<?php
        $url      = $_GET['url'];
        # Open connection
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_VERBOSE, 0);
        curl_setopt($ch, CURLOPT_POST, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        # Send post
        $result = curl_exec($ch);
        # Close connection
        curl_close($ch);
        echo $result;
?>