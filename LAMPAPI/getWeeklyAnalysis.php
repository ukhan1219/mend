<?php 

require 'config.php';

$userID = $_GET['userID'];

$stmt = $conn->prepare("SELECT * FROM weeklyAnalysis WHERE userID = ? ORDER BY dateCreated DESC LIMIT 1");
$stmt->bind_param("s", $userID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $analysis = $result->fetch_assoc();
    echo json_encode($analysis);
} else {
    echo json_encode(["error" => "No analysis found."]);
}
?>