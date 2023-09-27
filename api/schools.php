<?php
require("includes.inc");
include("functions.php");
include("auth.php");

$user_id = $_SESSION['user_id'];

$action = $_REQUEST['action'];
//retrieve personnel
if($action=="fetch"){
    $search = "%" . $_REQUEST['search'] . "%";
    $query = "SELECT *,get_users_fullname(sh_id) AS sh,get_users_fullname(sup_id) AS sup  FROM school WHERE school_name LIKE '$search' ORDER BY school_name ASC";
 
    mysqli_set_charset($conn, "utf8");

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
}

elseif($action=="fetch_users"){
  $search = "%" . $_REQUEST['search'] . "%";
  $code = $_REQUEST['code'];
  $position = ($code=="sh") ? "School Head":"Supervisor";
  $query = "SELECT id,employee_id,fullname FROM users WHERE fullname LIKE '$search' AND id>1 AND position='$position' ORDER BY fullname ASC LIMIT 0,5";

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
}


//insert record

//edit record
elseif($action=="edit"){
 $school_id = $_REQUEST['school_id'];
$school_name = strtoupper($_REQUEST['school_name']);
 $district = strtoupper($_REQUEST['district']);


    $sh_id = $_REQUEST['sh_id'];
    $sup_id = $_REQUEST['sup_id'];
    $id = $_REQUEST['id'];
    
    $check = mysqli_query($conn,"SELECT id FROM school WHERE sh_id=$sh_id AND id<>$id AND sh_id<>0");
    $row_count = mysqli_num_rows($check);
    if($row_count > 0){
        echo "true";
        exit();
    }

    $result = $conn->query('SET NAMES utf8'); //set names utf8

        $result = mysqli_query($conn,"UPDATE school SET school_id=$school_id,school_name='$school_name',district='$district',sh_id=$sh_id,sup_id=$sup_id WHERE id=$id");
        if($result){
            $log = mysqli_query($conn,"CALL logrecord($user_id,'Update school: $school_name'");
            echo "success";
        }

        $conn->close();
     
}

?>