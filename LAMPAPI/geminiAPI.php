<?php

function callGeminiAPI($journalEntries)
{
    $apiKey = getenv('GEMINI_API_KEY');
    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=$apiKey";

    $data = array(
        'contents' => array(
            array('parts' => array(
                array('text' => implode("\n", $journalEntries))
            ))
        )
    );

    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
    ));
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));

    $response = curl_exec($curl);
    curl_close($curl);

    return json_decode($response, true);
}
?>