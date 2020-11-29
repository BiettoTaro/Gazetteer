<?php

  ini_set('display_errors', 'On');
  error_reporting(E_ALL);

  $execution_start_time = microtime(true) / 1000;

  $key = '8soLxRM5kant2_BVS_IG-iAWXG5HFO_rVfS2oViBYao';

  $url = 'https://api.unsplash.com/search/photos?query=' . $_REQUEST['image'] . '&client_id=' . $key;

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_URL, $url);
  
  $result = curl_exec($ch);

  curl_close($ch);

  $decode = json_decode($result, true);

  $output['status']['code'] = "200";
  $output['status']['name'] = "ok";
  $output['status']['description'] = "mission saved";
  $output['status']['returnedIn'] = (microtime(true) - $execution_start_time) / 1000 . "ms";
  $output['data'] = $decode;

  header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);

  ?>