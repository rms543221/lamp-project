<?php


// Database credentials
$host = "localhost";
$username = "GoodClient";
$password = "7654321COP";
$database = "COP4331";

// Create a new MySQLi connection using the credentials above
$conn = new mysqli($host, $username, $password, $database);


// if connection not successful, a JSON error is returned
if ($conn->connect_error) {
    die(json_encode(array("error" => "Connection failed: " . $conn->connect_error)));
}
?>

