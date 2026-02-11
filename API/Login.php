<?php
// API endpoint to authenticate a user

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

// Validate the login and password fields
if (!isset($data["login"]) || !isset($data["password"])) {
    echo json_encode(["id" => 0]);
    exit;
}

$login = $data["login"];
$password = $data["password"];

// Look up the user by their login name 
$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Password FROM Users WHERE Login=?");
$stmt->bind_param("s", $login);
$stmt->execute();
$result = $stmt->get_result();

// If a matching user is found, verify the password
if ($row = $result->fetch_assoc()) {
    if ($password === $row["Password"]) {
        // Password matches — return the user's ID and name
        echo json_encode([
            "id" => (int)$row["ID"],
            "firstName" => $row["FirstName"],
            "lastName" => $row["LastName"]
        ]);
        exit;
    }
}

// return 0 to indicate no match
echo json_encode(["id" => 0]);
?>

