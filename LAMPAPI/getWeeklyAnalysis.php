<?php 

$conn = new mysqli("localhost", "API", "APIPASSWORD", "mend");

require 'generateAnalysis.php';

$userID = $_GET['userID'];

$analysisSummary = generateAnalysis($userID);

echo json_encode(['analysisSummary' => $analysisSummary]);

?>
