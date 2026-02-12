<?php
// API endpoint to delete a contact

require_once "db.php";

// Read JSON input from the request body
$data = json_decode(file_get_contents("php://input"), true);

// Validate that the contact and user ID are provided
if(!isset($data["id"]) || !isset($data["userId"])) {
    echo json_encode(["success" => false]);
    exit;
}

// Cast IDs to integers for safe use in the query
$id = (int)$data["id"];
$userId = (int)$data["userId"];

// allow user to delete contact
$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");
$stmt->bind_param("ii", $id, $userId);
$stmt->execute();


echo json_encode(["success" => true]);
?>

