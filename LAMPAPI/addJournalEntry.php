<?php

$inData = getRequestInfo();
$entryDate = $inData['entryDate'];
$entryContent = $inData['entryContent'];

$conn = new mysqli("localhost", "API", "APIPASSWORD", "mend");

if ($conn->connect_error){
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("INSERT INTO journalEntries (userID, entryDate, entryContent) VALUES (?,?,?)");
    $stmt->bind_param("sss", $inData['userID'], $entryDate, $entryContent);
    if ($stmt->execute()) {
        returnWithError(""); // Success
    } else {
        returnWithError($stmt->error); // Error from SQL execution
    }
    $stmt->close();
    $conn->close();

}
function getRequestInfo(){
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) 
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError( $err ) 
{
    $retValue = '{"error":"' . $err . '"}';
	sendResultInfoAsJson( $retValue );
}

?>
