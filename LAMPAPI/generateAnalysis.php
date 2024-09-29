<?php
require 'geminiAPI.php';


$conn = new mysqli("localhost", "API", "APIPASSWORD", "mend");

function fetchAllJournalEntries($userID) {
    global $conn;

    $stmt = $conn->prepare("SELECT entryContent FROM journalEntries WHERE userID = ?");
    $stmt->bind_param("s", $userID);
    $stmt->execute();
    $result = $stmt->get_result();

    $entries = [];
    while ($row = $result->fetch_assoc()) {
        $entries[] = $row['entryContent'];
    }
    return $entries;
}

function generateAnalysis($userID) {
    $journalEntries = fetchAllJournalEntries($userID); // Fetch all entries

    if (!empty($journalEntries)) {
        $analysis = callGeminiAPI($journalEntries);

        $analysisSummary = $analysis['contents'][0]['parts'][0]['text']; // Extract the summary from API response
        return $analysisSummary;
    }

    return "No journal entries found.";
}

?>