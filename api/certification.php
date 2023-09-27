<?php
require("includes.inc");
include("functions.php");
include("auth.php");

$user_id = $_SESSION['user_id'];

$action = $_REQUEST['action'];
//retrieve personnel
switch ($action){
    case "fetch":
    $school_year = $_REQUEST['school_year'];
    $query = "SELECT c.id,s.school_name,c.school_year,c.graduate_of,c.is_submitted,c.school_head,c.sds,(CASE WHEN c.is_submitted = 1 THEN '<span class=''badge badge-success''>Submitted</span>' ELSE '<span class=''badge badge-secondary''>Not yet submitted</span>' END) AS status,s.school_id FROM certification c,school s WHERE c.school_year='$school_year' AND c.sch_id=s.id ORDER BY s.school_name ASC, c.graduate_of ASC, c.id DESC";
  
    $result = $conn->query($query);
  
    $accumulatedRows = [];
    if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
        $accumulatedRows[] = $row;
      }
     
      echo json_encode($accumulatedRows);
    } else {
      echo json_encode([]);
    }
  
    $conn->close();
    break;

   
}


?>