<?php

include_once('config.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $firstName = $data['firstName'];
    $lastName = $data['lastName'];
    $email = $data['email'];
    $username = $data['username'];
    $password = $data['password'];
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT into users (firstName, lastName, username, email, password) VALUES (?,?,?,?,?)");
    $stmt->bind_param("sssss", $firstName, $lastName, $username, $email, $hashedPassword);
    
    $stmt->execute();
    
    $stmt->close();
    $conn->close();

} else {
    echo json_encode(["err" => "Invalid request."]);
}

?>
