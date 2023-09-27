<?php
require_once("includes.inc");
include("auth.php");
include("functions.php");


$user_id = $_SESSION["user_id"];
$result = mysqli_query($conn,"CALL logrecord($user_id,'Logout');");

session_start();
if(session_destroy()) // Destroying All Sessions
{
    header("Location: ../index.html"); // Redirecting To Home Page
}

?>