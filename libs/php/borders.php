<?php

  $executionStartTime = microtime(true);

  $countryData = json_decode(file_get_contents("countryBorders.geo.json"), true);

  $borders = null;

  foreach ($countryData['features'] as $feature) {

    if ($feature['properties']['iso_a2'] == $_REQUEST['country']) {

        $borders = $feature;
    }
  }


  $output['status']['code'] = 200;
  $output['status']['name'] = "ok";
  $output['status']['description'] = "success";
  $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
  $output['data'] = $borders;
  
  header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);