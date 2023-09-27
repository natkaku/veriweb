<?php
require("includes.inc");
include("functions.php");
include("auth.php");

$user_id = $_SESSION['user_id'];

$action = $_REQUEST['action'];

switch ($action){
    case "fetch":
        $school_year = $_REQUEST['school_year'];

        $query = "SELECT c.id,s.school_id,s.school_name,c.graduate_of,c.school_year,c.graduation_date,c.school_head,c.sds,c.is_submitted FROM certification c,school s WHERE s.sup_id=$user_id AND s.id=c.sch_id AND c.school_year='$school_year' ORDER BY s.school_name ASC,c.id DESC";
      
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
    
        case "verify_graduate":
            $id = $_REQUEST['id'];
            $fullname = $_REQUEST['fullname'];
        
            $query="UPDATE graduates SET is_validated=1,validatedBy=$user_id,validatedAt=DATE_ADD(NOW(), INTERVAL 8 HOUR) WHERE id=$id;";
        
            $result = mysqli_query($conn,$query);
                if($result){
                    $logrecord = mysqli_query($conn,"CALL logrecord($user_id,'Verified graduate/completer: $fullname' );");
                    echo "success";
                }
                $conn->close();
            break;
 
}

?>