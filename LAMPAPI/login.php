<?php

$inData = getRequestInfo();

$username = $inData['username'];
$password = $inData['password'];

$conn = new mysqli("localhost", "API", "APIPASSWORD", "mend");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Prepare the SQL query to get the stored hashed password for the username
    $stmt = $conn->prepare("SELECT id, firstName, lastName, password FROM users WHERE username=?");
    if ($stmt) {
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            $hashedPassword = $row['password'];
            // Verify the password entered by the user with the stored hashed password
            if (password_verify($password, $hashedPassword)) {
                // Password is correct, return user details
                $retValue = '{"id":' . $row['id'] . ',"firstName":"' . $row['firstName'] . '","lastName":"' . $row['lastName'] . '","error":""}';
                sendResultInfoAsJson($retValue);
            } else {
                // Invalid password
                returnWithError("Invalid Password");
            }
        } else {
            // Invalid username
            returnWithError("Invalid Username");
        }

        $stmt->close();
    } else {
        returnWithError($conn->error);
    }

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
