<?php
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["login"]) || !isset($data["password"])) {
    echo json_encode(["id" => 0]);
    exit;
}

$login = $data["login"];
$password = $data["password"];

$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Password FROM Users WHERE Login=?");
$stmt->bind_param("s", $login);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if ($password === $row["Password"]) { // plain text for class demo
        echo json_encode([
            "id" => (int)$row["ID"],
            "firstName" => $row["FirstName"],
            "lastName" => $row["LastName"]
        ]);
        exit;
    }
}

echo json_encode(["id" => 0]);
?>

