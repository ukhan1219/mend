<?php

include_once('config.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'];


    $query = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {

        $token = bin2hex(random_bytes(50));
        $resetLink = "http://98.81.175.225/reset_password.php?token=" . $token;

        // Save the token in the database with an expiration time
        $query = "UPDATE users SET reset_token = ?, token_expiration = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ss", $token, $email);
        $stmt->execute();


        $subject = "Password Reset";
        $message = "Click here to reset your password: " . $resetLink;
        $headers = "From: usman.k1219@gmail.com\r\n";

        if (mail($email, $subject, $message, $headers)) {
            echo json_encode(["success" => true, "message" => "Password reset link sent."]);
        } else {
            echo json_encode(["err" => "Failed to send email."]);
        }
    } else {
        echo json_encode(["err" => "Email not found."]);
    }
} else {
    echo json_encode(["err" => "Invalid request."]);
}
?>
