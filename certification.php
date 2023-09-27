<?php
    require("api/includes.inc");
    
  $datafound = true;
  $qr_id = $_REQUEST['id'];
            $query = "SELECT c.id,c.school_year,c.graduate_of,c.graduation_date,c.graduation_venue,c.school_head,c.sds,s.school_id,s.school_name FROM certification c,school s WHERE c.qr_id=$qr_id AND c.sch_id=s.id";
          
            $result = $conn->query($query);
            if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $cert_id =  $row['id'];
            $school_year =  $row['school_year'];
              $graduate_of =  $row['graduate_of'];
              $graduation_date =  $row['graduation_date'];
              $graduation_venue =  $row['graduation_venue'];
              $school_head =  $row['school_head'];
              $sds =  $row['sds'];
    
              $school_id =  $row['school_id'];
              $school_name =  $row['school_name'];
    
            }
        }else{$datafound=false;}

           
  
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="assets/js/jquery-3.3.1.min.js"></script>
    <script src="assets/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="assets/css/bootstrap.css">

    <title>VeriWeb</title>
</head>
<body>
    <div class="container">
        <?php if($datafound==false){echo "<h1>Data not Found!";  $conn->close();}else{?>
       <h1><?php echo $school_id . " " . $school_name?></h1>
       <p><?php echo "School Year: ". $school_year . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Graduates of  <strong>" . $graduate_of ."</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date of Graduation: " . $graduation_date?>
       <br><?php echo "School Head: <strong>". $school_head . "</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Schools Division Superintendent: <strong>" . $sds . "</strong>"?></p>
       
    
    <?php } ?>
    <div class="row">
        <div class="col-12">
        <input id="txtSearch" class="form-control" type="search" placeholder="Search by name" aria-label="Search" style=" margin-right: 10px;">
        </div>
    </div>
    <br>
    <div class="row table-responsive">

                <table class="table table-striped table-bordered table-sm" id="userTable">
                <thead><tr>
                    <th>#</th>
                    <th>LRN</th>
                    <th>Name of Graduates</th>
                    <th>Sex</th>
                     </tr></thead><tbody id="myTable">
                
                <?php
                        $query = "SELECT * FROM graduates WHERE cert_id=$cert_id AND is_validated=1 ORDER BY sex DESC,fullname ASC";

                        $result = $conn->query($query);
                        $i=0;
                        if ($result->num_rows > 0) {
                        while($row = $result->fetch_assoc()) {
                            $i++;
                            $num = $i;
                            $lrn =  $row['lrn'];
                        $fullname =  $row['fullname'];
                        $sex =  $row['sex']; 
                ?>
                        <tr>
                            <td><?php echo $num; ?></td>
                            <td><?php echo $lrn; ?></td>
                            <td><?php echo $fullname; ?></td>
                            <td><?php echo $sex; ?></td>
                        </tr>
                        
                 <?php           
                        }
                    }

                        $conn->close();
                ?>

                </table>
            </div>

    </div>

    
</body>
</html>

<script>
$(document).ready(function(){
 
 //Filter the table
 $("#txtSearch").on("keyup", function() {
   var value = $(this).val().toLowerCase();
   $("#myTable tr").filter(function() {
     $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
   });
 });

});

</script>