<?php
// API endpoint to create a new contact for a user

require_once "db.php";

// Reads the JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate that all of the fields are present
if(!isset($data["firstName"]) || !isset($data["lastName"]) || !isset($data["phone"]) || !isset($data["email"]) || !isset($data["userId"])) {
    echo json_encode(["success" => false]);
    exit;
}

// extracts contact fields from the request data
$firstName = $data["firstName"];
$lastName = $data["lastName"];
$phone = $data["phone"];
$email = $data["email"];
$userId = (int)$data["userId"];

// Inserts the new contact into the database
$stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);
$stmt->execute();


echo json_encode(["success" => true, "contactId" => $stmt->insert_id]);
?>

