<?php
require_once "db.php";

// Stores contents of the input file in an array
$data = json_decode(file_get_contents("php://input"), true);


// Checks if any fields are missing; if there are, registration fails
if (!isset($data["login"]) || !isset($data["password"]) || !isset($data["firstName"]) || !isset($data["lastName"])) {
    echo json_encode(["id" => 0]);
    exit;
}

// Stores input values into variables
$login = $data["login"];
$password = $data["password"];
$firstName = $data["firstName"];
$lastName = $data["lastName"];

// Check if login exists
$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
$stmt->bind_param("s", $login);
$stmt->execute();
$result = $stmt->get_result(); // Counts how many logins exist

if ($result->num_rows > 0) { // Login exists
    echo json_encode(["id" => 0]); // Registration fails
    exit;
}

// Insert new user
$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $firstName, $lastName, $login, $password); // Stores user info
$stmt->execute();

echo json_encode([
    "id" => (int)$stmt->insert_id,
    "firstName" => $firstName,
    "lastName" => $lastName
]);
?>

