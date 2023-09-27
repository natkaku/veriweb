<?php
require("includes.inc");
include("functions.php");
include("auth.php");
include("qr.php");

$user_id = $_SESSION['user_id'];

$action = $_REQUEST['action'];
//retrieve personnel
switch ($action){
    case "fetch":
    $sch_id = $_SESSION['sch_id'];
    $sy = $_REQUEST['sy'];
    $query = "SELECT * FROM certification WHERE sch_id=$sch_id AND school_year='$sy' ORDER BY id DESC";
  
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

    case "fetch_graduates":
        $cert_id = $_REQUEST['cert_id'];
        $query = "SELECT * FROM graduates WHERE cert_id=$cert_id ORDER BY sex DESC,fullname ASC";
      
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
//insert record
case "add":
    $school_year = $_REQUEST['school_year'];
    $graduate_of  = $_REQUEST['graduate_of'];
    $graduation_date  = $_REQUEST['graduation_date'];
    $graduation_venue  = $_REQUEST['graduation_venue'];
    $school_head  = $_REQUEST['school_head'];
    $sds  = $_REQUEST['sds'];
    $sch_id  = $_SESSION['sch_id'];
    $school_id  = $_SESSION['school_id'];
  $currentTime = time();
$generatedNumber = $school_id . intval(date('YmdHis', $currentTime));

    $query="INSERT INTO certification(school_year,graduate_of,graduation_date,graduation_venue,school_head,sds,sch_id,createdBy,createdAt,qr_id) VALUES('$school_year','$graduate_of','$graduation_date','$graduation_venue','$school_head','$sds',$sch_id,$user_id,DATE_ADD(NOW(), INTERVAL 8 HOUR),'$generatedNumber')";

    $result = $conn->query('SET NAMES utf8'); //set names utf8

    $result = mysqli_query($conn,$query);
        if($result){
            $logrecord = mysqli_query($conn,"CALL logrecord($user_id,'Add certfication: $school_year-$graduate_of');");
            
            create_qrcode($generatedNumber);
            echo "success";
        }
        $conn->close();
    break;

//edit record
case "edit":
  $school_year = $_REQUEST['school_year'];
  $graduate_of  = $_REQUEST['graduate_of'];
  $graduation_date  = $_REQUEST['graduation_date'];
  $graduation_venue  = $_REQUEST['graduation_venue'];
  $school_head  = $_REQUEST['school_head'];
  $sds  = $_REQUEST['sds'];
  $id  = $_REQUEST['id'];

  $query="UPDATE certification SET school_year='$school_year',graduate_of='$graduate_of',graduation_date='$graduation_date',graduation_venue='$graduation_venue',school_head='$school_head',sds='$sds' WHERE id=$id";

  $result = $conn->query('SET NAMES utf8'); //set names utf8

  $result = mysqli_query($conn,$query);
      if($result){
          $logrecord = mysqli_query($conn,"CALL logrecord($user_id,'Edit certfication details: $school_year-$graduate_of');");
          echo "success";
      }
      $conn->close();
     break;  

    case "add_graduate":
      $lastname = strtoupper(trim($_REQUEST['lastname']));
      $firstname = strtoupper(trim($_REQUEST['firstname']));
      $middlename = strtoupper(trim($_REQUEST['middlename']));
      $extensionname = strtoupper(trim($_REQUEST['extensionname']));
      $fullname = $lastname . ", " . $firstname . " " . $extensionname .  " " . $middlename;
    $fullname_initial = $firstname . " " . $extensionname . " " . substr($middlename,0,1) .  ". " . $lastname;
    $birthdate = $_REQUEST['birthdate'];
    $lrn = $_REQUEST['lrn'];
    $sex = $_REQUEST['sex'];
    $cert_id = $_REQUEST['cert_id'];
    $sch_id  = $_SESSION['sch_id'];
   
      $query="INSERT INTO graduates(lastname,firstname,middlename,extensionname,fullname,fullname_initial,birthdate,lrn,sex,sch_id,createdBy,createdAt,cert_id) VALUES('$lastname','$firstname','$middlename','$extensionname','$fullname','$fullname_initial','$birthdate','$lrn','$sex',$sch_id,$user_id,DATE_ADD(NOW(), INTERVAL 8 HOUR),$cert_id)";
  
      $result = $conn->query('SET NAMES utf8'); //set names utf8
  
      $result = mysqli_query($conn,$query);
          if($result){
              $logrecord = mysqli_query($conn,"CALL logrecord($user_id,'Add Graduate: $fullname');");
              echo "success";
          }
          $conn->close();
      break;

      case "edit_graduate":
        $lastname = strtoupper(trim($_REQUEST['lastname']));
        $firstname = strtoupper(trim($_REQUEST['firstname']));
        $middlename = strtoupper(trim($_REQUEST['middlename']));
        $extensionname = strtoupper(trim($_REQUEST['extensionname']));
        $fullname = $lastname . ", " . $firstname . " " . $extensionname .  " " . $middlename;
      $fullname_initial = $firstname . " " . $extensionname . " " . substr($middlename,0,1) .  ". " . $lastname;
      $birthdate = $_REQUEST['birthdate'];
      $lrn = $_REQUEST['lrn'];
      $sex = $_REQUEST['sex'];
   
      $id  = $_REQUEST['id'];
      $sch_id  = $_SESSION['sch_id'];
    
     
        $query="UPDATE graduates  SET lastname='$lastname',firstname='$firstname',middlename='$middlename',extensionname='$extensionname',fullname='$fullname',fullname_initial='$fullname_initial',birthdate='$birthdate',lrn='$lrn',sex='$sex' WHERE id=$id";
    
        $result = $conn->query('SET NAMES utf8'); //set names utf8
    
        $result = mysqli_query($conn,$query);
            if($result){
                $logrecord = mysqli_query($conn,"CALL logrecord($user_id,'Edited Graduate: $fullname');");
                echo "success";
            }
            $conn->close();
        break;

      case "delete_graduate":
      $id = $_REQUEST['id'];
      $fullname = $_REQUEST['fullname'];
     
        $query="DELETE FROM graduates WHERE id=$id";
     
        $result = mysqli_query($conn,$query);
            if($result){
                $logrecord = mysqli_query($conn,"CALL logrecord($user_id,'Delete Graduate: $fullname');");
                echo "success";
            }
            $conn->close();
        break;

        case "submit_graduate":
          $cert_id = $_REQUEST['cert_id'];
          $school_year  = $_REQUEST['school_year'];
          $graduate_of  = $_REQUEST['graduate_of'];
        
      
          $query="UPDATE certification SET is_submitted=1,submittedBy=$user_id,submittedAt=DATE_ADD(NOW(), INTERVAL 8 HOUR) WHERE id=$cert_id;";
      
          $result = mysqli_query($conn,$query);
              if($result){
                  $logrecord = mysqli_query($conn,"CALL logrecord($user_id,'Submitted for verification: SY: $school_year Graduates of $graduate_of');");
                  echo "success";
              }
              $conn->close();
          break;
}


?>