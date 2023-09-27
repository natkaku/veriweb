<?php
  require("includes.inc");

  session_start();
  session_destroy();

  $school_id = $_REQUEST["username"]; //school_id
  $password = $_REQUEST["password"];
  switch ($school_id){
    case (intval($school_id) < 1000000):
      $query = "SELECT u.firstname, u.lastname, u.position, u.employee_id, u.id,u.fullname,s.school_name,s.school_id,s.district,s.division,s.id AS sch_id from users u,school s WHERE s.school_id=$school_id AND s.sh_id=u.id AND BINARY u.pword=?";

  $stmt = $conn->prepare($query);
  $stmt->bind_result($firstname, $lastname, $position, $employee_id,$user_id,$fullname,$school_name,$school_id,$district,$division,$sch_id);
  $stmt->bind_param("s", $password);
  $stmt->execute();
  $stmt->store_result();
  
  $row = [];
  $acc = [];
  $rowCount = $stmt->num_rows;
  if ($rowCount > 0) {
    while($stmt->fetch()) {
      $row["firstname"] = $firstname;
      $row["lastname"] = $lastname;
      $row["position"] = $position;
      $row["employee_id"] = $employee_id;
      $row["id"] = $user_id;
      $row["fullname"] = $fullname;

      $row["school_name"] = $school_name;
      $row["school_id"] = $school_id;
      $row["district"] = $district;
      $row["division"] = $division;
      $row["sch_id"] = $sch_id;
    
 
      $acc[] = $row;
     
      //session start
      session_start();
      $_SESSION["firstname"] = $row["firstname"]; 
      $_SESSION["lastname"] = $row["lastname"]; 
      $_SESSION["position"] = $row["position"]; 
      $_SESSION["employee_id"] = $row["employee_id"]; 
      $_SESSION["user_id"] = $row["id"]; 
      $_SESSION["fullname"] = $row["fullname"]; 

      $_SESSION["school_name"] = $row["school_name"]; 
      $_SESSION["school_id"] = $row["school_id"]; 
      $_SESSION["district"] = $row["district"]; 
      $_SESSION["division"] = $row["division"]; 
      $_SESSION["sch_id"] = $row["sch_id"]; 

    }
    $stmt->close();
    $conn->close();
    echo json_encode($acc);
  }
  //if invalid password
  else{
    echo "0";
  }
      break;
  
    default:
    $query = "SELECT u.firstname, u.lastname, u.position, u.employee_id, u.id,u.fullname from users u WHERE u.employee_id=$school_id AND BINARY u.pword=? AND (position='Supervisor' OR position='Administrator')";

    $stmt = $conn->prepare($query);
    $stmt->bind_result($firstname, $lastname, $position, $employee_id,$user_id,$fullname);
    $stmt->bind_param("s", $password);
    $stmt->execute();
    $stmt->store_result();
    
    $row = [];
    $acc = [];
    $rowCount = $stmt->num_rows;
    if ($rowCount > 0) {
      while($stmt->fetch()) {
        $row["firstname"] = $firstname;
        $row["lastname"] = $lastname;
        $row["position"] = $position;
        $row["employee_id"] = $employee_id;
        $row["id"] = $user_id;
        $row["fullname"] = $fullname;
  
        $row["school_name"] = "";
        $row["school_id"] = "";
        $row["district"] = "";
        $row["division"] = "";
        $row["sch_id"] = "";
      
      
   
        $acc[] = $row;
       
        //session start
        session_start();
        $_SESSION["firstname"] = $row["firstname"]; 
        $_SESSION["lastname"] = $row["lastname"]; 
        $_SESSION["position"] = $row["position"]; 
        $_SESSION["employee_id"] = $row["employee_id"]; 
        $_SESSION["user_id"] = $row["id"]; 
        $_SESSION["fullname"] = $row["fullname"]; 
  
        $_SESSION["school_name"] = $row["school_name"]; 
        $_SESSION["school_id"] = $row["school_id"]; 
        $_SESSION["district"] = $row["district"]; 
        $_SESSION["division"] = $row["division"]; 
        $_SESSION["sch_id"] = $row["sch_id"]; 
  
      }
      $stmt->close();
      $conn->close();
      echo json_encode($acc);
    }
    //if invalid password
    else{
      echo "0";
    }
      break;

  }

  
?>