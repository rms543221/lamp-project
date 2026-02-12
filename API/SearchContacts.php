<?php
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data["search"]) || !isset($data["userId"])) {
    echo json_encode(["results" => []]);
    exit;
}

$search = "%" . $data["search"] . "%";
$userId = (int)$data["userId"];

$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID=? AND (FirstName LIKE ? OR LastName LIKE ?)");
$stmt->bind_param("iss", $userId, $search, $search);
$stmt->execute();
$result = $stmt->get_result();

$contacts = [];
while($row = $result->fetch_assoc()) {
    $contacts[] = $row;
}

echo json_encode(["results" => $contacts]);
?>

