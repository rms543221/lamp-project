<?php
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data["id"]) || !isset($data["userId"])) {
    echo json_encode(["success" => false]);
    exit;
}

$id = (int)$data["id"];
$userId = (int)$data["userId"];

// Only allow delete if the contact belongs to the user
$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");
$stmt->bind_param("ii", $id, $userId);
$stmt->execute();

echo json_encode(["success" => true]);
?>

