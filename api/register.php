<?php

$inData = getRequestInfo();

$firstName = $inData['firstName'];
$lastName = $inData['lastName'];
$email = $inData['email'];
$username = $inData['username'];
$password = $inData['password'];
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "mend");

if ($conn->connect_error){
    returnWithError($conn->connect_error);
} else{
    $stmt = $conn->prepare("INSERT INTO users (firstName, lastName, email, username, password) VALUES (?,?,?,?,?)");
    $stmt->bind_param("sssss",  $firstName, $lastName, $email, $username, $hashedPassword);
    $stmt->execute();
    $stmt->close();
    $conn->close();
    returnWithError("");

}

function getRequestInfo() {
    return  json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) 
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError( $err ) 
{
    $retValue = '{"error":"' . $err . '"}';
	sendResultInfoAsJson( $retValue );
}

?>