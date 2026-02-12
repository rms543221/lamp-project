<?php
require_once "db.php";

// Stores content of the input file in an array
$data = json_decode(file_get_contents("php://input"), true);

// Check if any required fields are missing
if(!isset($data["search"]) || !isset($data["userId"])) {
    echo json_encode(["results" => []]);
    exit;
}

$search = "%" . $data["search"] . "%";
$userId = (int)$data["userId"];

// Filter by userID so users can only see their own contacts
// Also searches for partial matches in FirstName and LastName
$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID=? AND (FirstName LIKE ? OR LastName LIKE ?)");
$stmt->bind_param("iss", $userId, $search, $search);
$stmt->execute();
$result = $stmt->get_result();

// Creates the list of contacts
$contacts = [];
// Fill each entry in contacts with the matching users
while($row = $result->fetch_assoc()) {
    $contacts[] = $row;
}

// Returns a list of contacts matching the search
echo json_encode(["results" => $contacts]);
?>

