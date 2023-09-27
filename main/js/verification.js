$(document).ready(function(){
 
   

 });
 
 $('#cboSchoolYear').change(function() {
  Processing_Modal("Loading!");
  load_verification($(this).val()); //load personnel record
    Processing_Close(500);
});

  //Filter the table
  $("#txtSearch").on("keyup", function() {
   var value = $(this).val().toLowerCase();
   $("#myTable tr").filter(function() {
     $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
   });
 });
 
 
 $("#btnSearchButton").on("click", function(){
 $("#hidden_start").val("1");
   Processing_Modal("Loading!");
   load_systemuser($("#txtSearch").val());
   Processing_Close(500);
   }); //cnd search button
 
  
  $("#btnAdd").on("click", function(){
   $("#btnUserSave").show();
   $("#btnUserUpdate").hide();
   $("#hidden_menu").val("add");
   $("#addUserTitle").html("Add User");
   clear_content();
 }); //end btnAdd
 
 $(document).on("click",".btnView", function(){
   var id = $(this).data("id");
   var school_id = $(this).data("school_id");
   var school_name = $(this).data("school_name");
   var graduate_of = $(this).data("graduate_of");
   var school_year = $(this).data("school_year");
    
     $("#addUserTitle").html(school_id + " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + school_name + "<br>Graduates/Completers of "+ graduate_of + " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SY: " + school_year);

     Processing_Modal("Loading!");
     load_graduates(id);
     Processing_Close(500);
    
  
 }); //.btnEdit
 
 $(document).on("click",".btnRemove", function(){
   var id = $(this).data("id");
   var personnel_name = $(this).data("name");
   Swal.fire({
       title: 'Are you sure?',
       text: "Remove "  + personnel_name,
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Yes'
       }).then((result) => {
       if (result.isConfirmed) {
           Swal.fire({ title: 'Loading!', html: 'Please wait..',allowOutsideClick: false,onBeforeOpen: () => { Swal.showLoading() }, });
           //remove ajax
           $.ajax({
               url: "../api/users.php", method: "POST", data: {id:id, action:"delete_personnel",personnel_name:personnel_name},success:function(data){
                 console.log(data);
                 if(data=="success") {
                   Swal.fire(
                     'Deleted!',
                     personnel_name + ' removed.',
                     'success'
                     )
                     load_systemuser($("#txtSearch").val());
     
                 } 
               
               },error: function(xhr, status, error){
                   var errorMessage = xhr.status + ': ' + xhr.statusText 
               Swal.fire({icon: 'error',title: 'Error....',text: 'No network connection!'}) 
               }
           });
 
          
       }
       })
 }); // end .btnRemove
 
 $("#user_add").on("submit",function(event){
     event.preventDefault();
     var menu = $("#hidden_menu").val();
     var id = $("#hidden_id").val();
     var role = $("#cboUserRole").val();
     var employee_id = $("#txtemployee_id").val();
     var firstname = $("#txtfirstname").val();
     var lastname = $("#txtlastname").val();
     var middlename = $("#txtmiddlename").val();
     var extensionname = $("#txtextension").val();
     var designation = $("#txtdesignation").val();
     var email = $("#txtemail").val();
     var address = $("#txtaddress").val();
     var contactno = $("#txtcontactno").val();
     Processing_Modal("Processing!");
     $.ajax({
         url: "../api/users.php", method:"POST",
         data: {action:menu, firstname:firstname,lastname:lastname,middlename:middlename,extensionname:extensionname,designation:designation,email:email,address:address,contactno:contactno, id:id,employee_id:employee_id,role:role},
         success: function(data){  
           if(data=="success"){
             Swal.fire({
               position: 'center',
               icon: 'success',
               title: (menu=="add") ? 'Record Saved!':'Record Update',
               showConfirmButton: false,
               timer: 1500
             })
             $("#userModal").modal("hide");
             load_systemuser($("#txtSearch").val());
           Processing_Close(1000);
           }else{
             var errorMessage = "Unable to save/update data"
             Error_Message_SweetAlert(errorMessage); 
           }
                
             
         },
             error: function(xhr, status, error){
             var errorMessage = xhr.status + ': ' + xhr.statusText
             Error_Message_SweetAlert(errorMessage); }
     });
 
 });
 //end of submit
 
 function clear_content(){
   $("#txtemployee_id").val("");
     $("#txtfirstname").val("");
     $("#txtlastname").val("");
     $("#txtmiddlename").val("");
     $("#txtextension").val("");
     $("#txtdesignation").val("");
     $("#txtemail").val("");
     $("#txtaddress").val("");
     $("#txtcontactno").val("");
 
 }
 
 function load_verification(school_yr){
 
     $.ajax({
         url: "../api/verification.php", method: "GET", dataType: "JSON",data: {action:"fetch",school_year:school_yr},
         success: function(data){

             var string = JSON.stringify(data);
             var parse = JSON.parse(string);
             var dataRow = "<table><thead><tr>" +
                          "<th>#</th>" +
                          "<th>School ID</th>" +
                         "<th>School Name</th>" +
                         "<th>School Year</th>" +
                         "<th>Graduates/Completers of</th>" +
                         "<th>Date of Graduation</th>" +
                     "<th>Action</th>" +
                     "</tr></thead><tbody id='myTable'>";
                     var rowCount = parse.length;
 
                     var i=0;
 
                     while(i < rowCount){
                         var no = i + 1;       
                         var id = parse[i]['id'] ;
                         var school_id = parse[i]['school_id'] ;
                         var school_name = parse[i]['school_name'] ;
                         var graduate_of = parse[i]['graduate_of'];
                         var school_year = parse[i]['school_year'] ;
                         var graduation_date = parse[i]['graduation_date'];
                         var date = new Date(graduation_date); // Get the current date

                        var formattedDate = date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
                        
                         var school_head = parse[i]['school_head'];
                         var sds = parse[i]['sds'];
                         var is_submitted = parse[i]['is_submitted'];
                    
                         var tblRow = "<tr>";
                         tblRow += "<td>" + no + "</td>";
                         tblRow += "<td>" + school_id + "</td>";
                         tblRow += "<td>" + school_name + "</td>";
                         tblRow += "<td>" + graduate_of + "</td>";
                         tblRow += "<td>" + school_year + "</td>";
                         tblRow += "<td>" + formattedDate + "</td>";
                      
                        tblRow += (is_submitted==1) ? "<td><button type='button' class='btn btn-warning btn-sm btnView' title='View Graduates/Completers' data-id='"+id+"' data-school_id='"+school_id+"' data-school_name='"+school_name+"' data-graduation_date='"+graduation_date+"' data-school_year='"+school_year+"' data-graduate_of='"+graduate_of+"' data-school_head='"+school_head+"' data-sds='"+sds+"' data-toggle='modal' data-target='#userModal'><span class='fa fa-bars'></span> Graduates/Completers</button> &nbsp;" : "<td><span class='badge badge-danger'>Not yet submitted</span>";
                    
 
 
                             tblRow += "</td></tr>";
                             dataRow += tblRow;
                             i++;
                     }
 
                     dataRow += "</tbody></table>";
 
                     $("#userTable").html(dataRow);
                     document.getElementById("lblRecords").innerHTML = rowCount;
 
         }
 
     });
 }

 function load_graduates(cert_id){
 
    $.ajax({
        url: "../api/verification.php", method: "GET", dataType: "JSON",data: {action:"fetch_graduates",cert_id:cert_id},
        success: function(data){

            var string = JSON.stringify(data);
            var parse = JSON.parse(string);
            var dataRow = "<table><thead><tr>" +
                         "<th>#</th>" +
                         "<th>LRN</th>" +
                        "<th>Name of Graduates/Completers</th>" +
                        "<th>Sex</th>" +
                    "<th>Action/Status</th>" +
                    "</tr></thead><tbody id='myTableGraduate'>";
                    var rowCount = parse.length;

                    var i=0;

                    while(i < rowCount){
                        var no = i + 1;       
                        var id = parse[i]['id'] ;
                        var lrn = parse[i]['lrn'] ;
                        var fullname = parse[i]['fullname'] ;
                        var sex = parse[i]['sex'];
                        var is_validated = parse[i]['is_validated'] ;
                        var cert_id = parse[i]['cert_id'] ;
                       
                       
                        var tblRow = "<tr>";
                        tblRow += "<td>" + no + "</td>";
                        tblRow += "<td>" + lrn + "</td>";
                        tblRow += "<td>" + fullname + "</td>";
                        tblRow += "<td>" + sex + "</td>";
                     
                       tblRow += (is_validated==0) ? "<td id='td"+id+"'><button type='button' class='btn btn-warning btn-sm btnVerify' title='Verify/Validate Graduates' data-id='"+id+"' data-lrn='"+lrn+"' data-fullname='"+fullname+"' data-sex='"+sex+"' data-is_validated='"+is_validated+"' data-cert_id='"+cert_id+"'><span class='fa fa-check'></span> Verify</button> &nbsp;" : "<td 'td"+id+"'><span class='badge badge-success'>Verified</span>";
                     
                            tblRow += "</td></tr>";
                            dataRow += tblRow;
                            i++;
                    }

                    dataRow += "</tbody></table>";

                    $("#graduatesTable").html(dataRow);
                  
        }

    });
}

$(document).on("click",".btnVerify", function(){
    var id = $(this).data("id");
    var fullname = $(this).data("fullname");
  
    Swal.fire({
        title: 'Verify graduate/completer?',
        text: 'Name: '  + fullname,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({ title: 'Loading!', html: 'Please wait..',allowOutsideClick: false,onBeforeOpen: () => { Swal.showLoading() }, });
            //remove ajax
            $.ajax({
                url: "../api/verification.php", method: "POST", data: {id:id,fullname:fullname, action:"verify_graduate"},success:function(data){
       
                  if(data=="success") {
                    Swal.fire(
                      'Verified!',
                      'Name: '  + fullname,
                      'success'
                      )
                  
                      display_verified(id)
                      Processing_Close(1000);
      
                  } 
                
                },error: function(xhr, status, error){
                    var errorMessage = xhr.status + ': ' + xhr.statusText 
                Swal.fire({icon: 'error',title: 'Error....',text: 'No network connection!'}) 
                }
            });
  
        }
        })
  }); // end verification

  function display_verified(id){
    $("#td"+id).html("<span class='badge badge-success'>Verified</span>");
  }
 
 