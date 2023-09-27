<?php


$port = 3306;
  define("DB_CONNECT_SUCCESS_NOTIF", "<h2>Configuration success!</h2>Looks like MySQL, PHP, and Apache are all working.");
  define("DB_CONNECT_ERROR_NOTIF", "<h2>Unable to get a mysql db connection.</h2>Check if username and password are correct, and/or that the MySQL server is running at port $port");

$server = "localhost";
$username = "root";
$password = "root";
$conn = new mysqli($server, $username, $password);
$conn->select_db("veriweb");

?>