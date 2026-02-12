<?php
require_once "db.php";

// Stores the contents of the input file into an array
$data = json_decode(file_get_contents("php://input"), true);

// Check if any required fields are empty
if(!isset($data["id"]) || !isset($data["firstName"]) || !isset($data["lastName"]) || !isset($data["phone"]) || !isset($data["email"]) || !isset($data["userId"])) {
    echo json_encode(["success" => false]);
    exit;
}

// Assign the data from the array into variables
$id = (int)$data["id"];
$firstName = $data["firstName"];
$lastName = $data["lastName"];
$phone = $data["phone"];
$email = $data["email"];
$userId = (int)$data["userId"];

// Only allow update if the contact belongs to the user
$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=? AND UserID=?");
// Tells MySQL there will be 4 strings and 2 integers
$stmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $id, $userId);
$stmt->execute();

echo json_encode(["success" => true]);
?>

