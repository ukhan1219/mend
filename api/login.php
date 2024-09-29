<?php

include_once('config.php');

// Specify content type for the response
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get JSON input and decode it
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if username and password are set in the data
    if (isset($data["username"]) && isset($data["password"])) {
        // Sanitize the input (this step is optional since you're using prepared statements, but it's good practice)
        $username = filter_var($data["username"], FILTER_SANITIZE_STRING);
        $password = $data["password"];

        // Prepare the SQL statement
        $stmt = $conn->prepare("SELECT ID, firstName, lastName, password FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        
        // Get the result
        $result = $stmt->get_result();

        // Check if any rows are returned
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            // Verify the password
            if (password_verify($password, $user['password'])) {
                // Login successful, return user details
                $id = $user['ID'];
                $firstName = $user['firstName'];
                $lastName = $user['lastName'];

                echo json_encode([
                    "success" => true, 
                    "message" => "Login successful", 
                    "user" => [
                        "id" => $id,
                        "firstName" => $firstName,
                        "lastName" => $lastName
                    ]
                ]);
            } else {
                // Password mismatch
                echo json_encode([
                    "success" => false,
                    "message" => "Invalid username or password."
                ]);
            }
        } else {
            // Username not found
            echo json_encode([
                "success" => false,
                "message" => "Invalid username or password."
            ]);
        }

        // Close statement
        $stmt->close();
    } else {
        // Invalid request, missing username or password in JSON data
        echo json_encode([
            "success" => false,
            "message" => "Invalid request. Missing username or password."
        ]);
    }

    // Close connection
    $conn->close();
} else {
    // Request is not a POST
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
}

?>
