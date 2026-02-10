<?php
$host = "localhost";
$username = "GoodClient";
$password = "7654321COP";
$database = "COP4331";

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(array("error" => "Connection failed: " . $conn->connect_error)));
}
?>

