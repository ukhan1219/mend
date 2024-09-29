<?php

    include_once('config.php');

    // JSON response array
    $response = array();

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        
        $data = json_decode(file_get_contents("php://input"), true);

        // Check if the required fields are set
        if (isset($data['userID']) && isset($data['entryDate']) && isset($data['entryContent'])) {
            
            $userID = $data['userID'];
            $entryDate = $data['entryDate'];
            $entryContent = $data['entryContent'];
            $query = "INSERT INTO journalEntries (userID, entryDate, entryContent, dateCreated) VALUES (?, ?, ?, NOW())";

            // Prepare the statement to avoid SQL injection
            if ($stmt = $conn->prepare($query)) {
                
                $stmt->bind_param("iss", $userID, $entryDate, $entryContent);

                if ($stmt->execute()) {
                    $response['success'] = true;
                    $response['message'] = "Journal entry added successfully";
                } else {
                    $response['err'] = "Error: " . $stmt->error;
                }
                $stmt->close();
            } else {
                $response['err'] = "Failed to prepare statement";
            }
        } else {
            $response['err'] = "Missing required fields (userID, entryDate, entryContent)";
        }
    } else {
        $response['err'] = "Invalid request method";
    }
    echo json_encode($response);
?>
