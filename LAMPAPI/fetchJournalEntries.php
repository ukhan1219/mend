<?php
    $inData = getRequestInfo();
    $userID = $inData["userID"];

    $conn = new mysqli("localhost", "API", "APIPASSWORD", "mend");

    if ($conn->connect_error) {
        returnWithError( $conn->connect_error );
    } else {
        $stmt = $conn->prepare("SELECT ID, entryDate, entryContent FROM journalEntries WHERE userID = ?");
        $stmt->bind_param("i", $userID);
        $stmt->execute();

        $result = $stmt->get_result();
        $searchResults = "";
        $searchCount = 0;

        while ($row = $result->fetch_assoc()) {
            if ($searchCount > 0) {
                $searchResults .= ",";
            }
            $searchCount++;
            $searchResults .= '{"ID":"' . $row["ID"] . '", "entryDate":"' . $row["entryDate"] . '", "entryContent":"' . $row["entryContent"] . '"}';
        }

        if ($searchCount == 0) {
            returnWithError("No journal entries found");
        } else {
            returnWithInfo($searchResults);
        }

        $stmt->close();
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
        $retValue = '{"id":0,"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($searchResults) {
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
