<?php
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["login"]) || !isset($data["password"]) || !isset($data["firstName"]) || !isset($data["lastName"])) {
    echo json_encode(["id" => 0]);
    exit;
}

$login = $data["login"];
$password = $data["password"];
$firstName = $data["firstName"];
$lastName = $data["lastName"];

// Check if login exists
$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
$stmt->bind_param("s", $login);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["id" => 0]); // login exists
    exit;
}

// Insert new user
$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
$stmt->execute();

echo json_encode([
    "id" => (int)$stmt->insert_id,
    "firstName" => $firstName,
    "lastName" => $lastName
]);
?>

