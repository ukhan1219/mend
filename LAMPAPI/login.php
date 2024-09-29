<?php

$inData = getRequestInfo();

$username = $inData['username'];
$password = $inData['password'];

$conn = new mysqli("localhost", "API", "APIPASSWORD", "mend");

console.log("1");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    console.log("2");
} else {
    // Prepare the SQL query to get the stored hashed password for the username
    $stmt = $conn->prepare("SELECT id, firstName, lastName, password FROM users WHERE username=?");
    console.log("3");
    if ($stmt) {
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        console.log("4");

        if ($row = $result->fetch_assoc()) {
            $hashedPassword = $row['password'];
            console.log("5");
            
            // Verify the password entered by the user with the stored hashed password
            if (password_verify($password, $hashedPassword)) {
                console.log("6");
                
                // Password is correct, return user details
                $retValue = '{"id":' . $row['id'] . ',"firstName":"' . $row['firstName'] . '","lastName":"' . $row['lastName'] . '","error":""}';
                sendResultInfoAsJson($retValue);
            } else {
                // Invalid password
                returnWithError("Invalid Password");
                console.log("7");
            }
        } else {
            // Invalid username
            returnWithError("Invalid Username");
            console.log("8");
        }
        console.log("9");
        $stmt->close();
    } else {
        returnWithError($conn->error);
        console.log("10");
    }
    console.log("11");
    $conn->close();
}

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err) {
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

?>
