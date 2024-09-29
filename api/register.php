<?php

$inData = getRequestInfo();

$firstName = $inData['firstName'];
$lastName = $inData['lastName'];
$email = $inData['email'];
$username = $inData['username'];
$password = $inData['password'];
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$conn = new mysqli("localhost", "API", "APIPASSWORD", "mend");

if ($conn->connect_error){
    returnWithError($conn->connect_error);
} else{
    $stmt = $conn->prepare("INSERT INTO users (firstName, lastName, email, username, password) VALUES (?,?,?,?,?)");
    if ($stmt) {
        $stmt->bind_param("sssss", $firstName, $lastName, $email, $username, $hashedPassword);
        if ($stmt->execute()) {
            returnWithError(""); // Success
        } else {
            returnWithError($stmt->error); // Error from SQL execution
        }
        $stmt->close();
    } else {
        returnWithError($conn->error); // Error from prepare statement
    }
    $conn->close();
    

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