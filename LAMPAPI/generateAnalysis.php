<?php
require 'geminiAPI.php';
require 'config.php';

function fetchJournalEntries($userID) {
    global $conn;

    $weekStart = date('Y-m-d', strtotime('last Sunday'));
    $weekEnd = date('Y-m-d');

    $stmt = $conn->prepare("SELECT entryContent FROM journalEntries WHERE userID = ? AND entryDate BETWEEN ? AND ?");
    $stmt->bind_param("sss", $userID, $weekStart, $weekEnd);
    $stmt->execute();
    $result = $stmt->get_result();

    $entries = [];
    while ($row = $result->fetch_assoc()) {
        $entries[] = $row['entryContent'];
    }
    return $entries;
}

function storeWeeklyAnalysis($userID, $weekStartDate, $weekEndDate, $analysisSummary) {
    global $conn;

    $stmt = $conn->prepare("INSERT INTO weeklyAnalysis (userID, weekStartDate, weekEndDate,  analysisSummary) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $userID, $weekStartDate, $weekEndDate,  $analysisSummary);
    $stmt->execute();
}

function generateWeeklyAnalysis($userID) {
    $journalEntries = fetchJournalEntries($userID); 

    if (!empty($journalEntries)) {
        $analysis = callGeminiAPI($journalEntries);

        // maybe not needed
        $analysisSummary = $analysis['contents'][0]['parts'][0]['text'];  // Extract the summary text from API response

        $weekStartDate = date('Y-m-d', strtotime('last Sunday'));
        $weekEndDate = date('Y-m-d');
        storeWeeklyAnalysis($userID, $weekStartDate, $weekEndDate, $analysisSummary);
    }
}
?>