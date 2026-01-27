<?php
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data["firstName"]) || !isset($data["lastName"]) || !isset($data["phone"]) || !isset($data["email"]) || !isset($data["userId"])) {
    echo json_encode(["success" => false]);
    exit;
}

$firstName = $data["firstName"];
$lastName = $data["lastName"];
$phone = $data["phone"];
$email = $data["email"];
$userId = (int)$data["userId"];

$stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);
$stmt->execute();

echo json_encode(["success" => true, "contactId" => $stmt->insert_id]);
?>

