<?php
require("includes.inc");
include("functions.php");
include("auth.php");

$user_id = $_SESSION['user_id'];

$action = $_REQUEST['action'];
//retrieve personnel
if($action=="fetch"){
    $search = "%" . $_REQUEST['search'] . "%";
    $query = "SELECT * FROM users WHERE fullname LIKE '$search' AND id>1 ORDER BY fullname ASC";
  
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
elseif($action=="add"){
  $role = $_REQUEST['role'];
    $employee_id = strtoupper($_REQUEST['employee_id']);
    $firstname = strtoupper($_REQUEST['firstname']);
    $lastname = strtoupper($_REQUEST['lastname']);
    $middlename = strtoupper($_REQUEST['middlename']);
    $extensionname = strtoupper($_REQUEST['extensionname']);
    $designation = $_REQUEST['designation'];
    $email  = $_REQUEST['email'];
    $address  = $_REQUEST['address'];
    $contactno  = $_REQUEST['contactno'];
    //$active   = $_REQUEST['active'];
    $fullname = $lastname . ", " . $firstname . " " . $extensionname .  " " . $middlename;
    $fullname_initial = $firstname . " " . $extensionname . " " . substr($middlename,0,1) .  ". " . $lastname;
  
       
    $result = $conn->query('SET NAMES utf8'); //set names utf8

    $result = mysqli_query($conn,"INSERT INTO users(lastname,firstname,middlename,extensionname,designation,email,address,contactno,fullname,createdBy,employee_id,pword,fullname_initial,position,createdAt) VALUES('$lastname','$firstname','$middlename','$extensionname','$designation','$email','$address','$contactno','$fullname',$user_id,$employee_id,$employee_id,'$fullname_initial','$role',DATE_ADD(NOW(), INTERVAL 8 HOUR))");
        
        if($result){
            $logrecord = mysqli_query($conn,"CALL logrecord($user_id,'Add user: $fullname');");
            echo "success";
        }
        $conn->close();

}

//edit record
elseif($action=="edit"){
  $role = $_REQUEST['role'];
  $employee_id = strtoupper($_REQUEST['employee_id']);
    $firstname = strtoupper($_REQUEST['firstname']);
    $lastname = strtoupper($_REQUEST['lastname']);
    $middlename = strtoupper($_REQUEST['middlename']);
    $extensionname = strtoupper($_REQUEST['extensionname']);
    $designation = $_REQUEST['designation'];
    $email  = $_REQUEST['email'];
    $address  = $_REQUEST['address'];
    $contactno  = $_REQUEST['contactno'];
    $fullname = $lastname . ", " . $firstname . " " . $extensionname .  " " . $middlename;
    $fullname_initial = $firstname . " " . $extensionname . " " . substr($middlename,0,1) .  ". " . $lastname;
    $id = $_REQUEST['id'];
        
    $result = $conn->query('SET NAMES utf8'); //set names utf8

        $result = mysqli_query($conn,"UPDATE users SET lastname='$lastname',firstname='$firstname',middlename='$middlename',extensionname='$extensionname',designation='$designation',email='$email',address='$address',contactno='$contactno',fullname='$fullname',employee_id=$employee_id,position='$role' WHERE id=$id");
        if($result){
            $logrecord = mysqli_query($conn,"CALL logrecord($user_id,'Edit user: $fullname');");
            echo "success";
        }

        $conn->close();
}

elseif($action=="resetpassword"){
 
  $employee_id = $_REQUEST['employee_id'];
  $fullname = $_REQUEST['fullname'];
    $id = $_REQUEST['id'];
        $result = mysqli_query($conn,"UPDATE users SET pword='$employee_id' WHERE id=$id");
        if($result){
            $logrecord = mysqli_query($conn,"CALL logrecord($user_id,'Reset password: $fullname');");
            echo "success";
        }

        $conn->close();
}


?>