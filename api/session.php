<?php
 include("auth.php");

 $output["firstname"] = $_SESSION["firstname"];
 $output["lastname"] = $_SESSION["lastname"];
 $output["position"] = $_SESSION["position"];
 $output["employee_id"] = $_SESSION["employee_id"];
 $output["user_id"] = $_SESSION["user_id"];
 $output["fullname"] = $_SESSION["fullname"];
 

 $output["school_name"] = $_SESSION["school_name"];
 $output["school_id"] = $_SESSION["school_id"];
 $output["district"] = $_SESSION["district"];
 $output["division"] = $_SESSION["division"];
 $output["sch_id"] = $_SESSION["sch_id"];
 
 echo json_encode($output);

?>