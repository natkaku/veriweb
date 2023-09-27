<?php
    require("includes.inc");
    include("functions.php");
    include("auth.php");

    $newpassword = $_REQUEST["newpassword"];
    $currentpassword = $_REQUEST["currentpassword"];
    $id = $_SESSION["user_id"];
    $username = $_SESSION["employee_id"];
  
    $sql = "select * from users where employee_id=$username and pword='$currentpassword'";
    $result = mysqli_query($conn,$sql);
    $row_count = mysqli_num_rows($result);
    if($row_count < 1){
        echo "false";
    }
    else{
        $logMsg="Change password";
        $query = "UPDATE users SET pword=? WHERE id=?;";
   
        $stmt = $conn->prepare($query);
        $stmt->bind_param("si", $newpassword, $id);
      
        $success = $stmt->execute();
        $stmt->store_result();
      
        $arr["rows_affected"] = $conn->affected_rows;
      
        $stmt->close();

        $logrecord = mysqli_query($conn,"CALL logrecord($id,'$logMsg');");
        $conn->close();
      
        echo "true";


    }

?>