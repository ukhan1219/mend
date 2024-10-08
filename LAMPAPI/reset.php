<?php

include_once('config.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $token = $data['token'];
    $newPassword = $data['newPassword'];


    $query = "SELECT * FROM users WHERE reset_token = ? AND token_expiration > NOW()";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {

        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
        $query = "UPDATE users SET password = ?, reset_token = NULL, token_expiration = NULL WHERE reset_token = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ss", $hashedPassword, $token);
        $stmt->execute();

        echo json_encode(["success" => true, "message" => "Password has been reset."]);
    } else {
        echo json_encode(["err" => "Invalid or expired token."]);
    }
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["err" => "Invalid request."]);
}
?>
