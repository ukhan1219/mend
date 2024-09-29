<?php

include_once('config.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = 0;
    $firstName = "";
    $lastName = "";

    $stmt = $conn->prepare("SELECT ID, firstName, lastName, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $data["username"]);
    $stmt->execute();
    
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        if (password_verify($data['password'], $user['password'])) {
            $id = $user['ID'];
            $firstName = $user['firstName'];
            $lastName = $user['lastName'];

            echo json_encode(["success" => true, "message" => "Login successful", "user" => [
                "id" => $id,
                "firstName" => $firstName,
                "lastName" => $lastName
            ]]);
        } else {
            echo json_encode(["err" => "Invalid username or password."]);
        }
    } else {
        echo json_encode(["err" => "Invalid username or password."]);
    }
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["err" => "Invalid request."]);
}

?>
