<?php
// Include database connection
include_once('config.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'];

    // Validate email existence in the database
    $query = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Generate a reset token and link
        $token = bin2hex(random_bytes(50)); // Generate a random token
        $resetLink = "http://yourdomain.com/reset_password.php?token=" . $token;

        // Save the token in the database with an expiration time
        $query = "UPDATE users SET reset_token = ?, token_expiration = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ss", $token, $email);
        $stmt->execute();

        // Send an email with the reset link (use mail() or a library like PHPMailer)
        // mail($email, "Password Reset", "Click here to reset your password: " . $resetLink);
        echo json_encode(["success" => true, "message" => "Password reset link sent."]);
    } else {
        echo json_encode(["err" => "Email not found."]);
    }
} else {
    echo json_encode(["err" => "Invalid request."]);
}
?>
