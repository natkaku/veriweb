$(document).ready(function(){
 
    Processing_Modal("Loading!");
    load_systemuser($("#txtSearch").val()); //load personnel record
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
 
 $(document).on("click",".btnEdit", function(){
     $("#btnUserSave").hide();
     $("#btnUserUpdate").show();
     $("#hidden_menu").val("edit");
     $("#addUserTitle").html("Edit User");
     $("#hidden_id").val($(this).data("id"));
     $("#cboUserRole").val($(this).data("role"));
     $("#txtemployee_id").val($(this).data("employee_id"));
     $("#txtfirstname").val($(this).data("firstname"));
     $("#txtlastname").val($(this).data("lastname"));
     $("#txtmiddlename").val($(this).data("middlename"));
     $("#txtextension").val($(this).data("extensionname"));
     $("#txtdesignation").val($(this).data("designation"));
     $("#txtemail").val($(this).data("email"));
     $("#txtaddress").val($(this).data("address"));
     $("#txtcontactno").val($(this).data("contactno"));
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

 $(document).on("click",".btnReset", function(){
  var id = $(this).data("id");
  var fullname = $(this).data("fullname");
  var employee_id = $(this).data("employee_id");
  Swal.fire({
      title: 'Are sure you want to reset user\'s password?',
      text:  fullname,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
      }).then((result) => {
      if (result.isConfirmed) {
          Swal.fire({ title: 'Loading!', html: 'Please wait..',allowOutsideClick: false,onBeforeOpen: () => { Swal.showLoading() }, });
       
          $.ajax({
              url: "../api/users.php", method: "POST", data: {id:id, action:"resetpassword",fullname:fullname,employee_id:employee_id},success:function(data){
               
                if(data=="success") {
                  Swal.fire(
                    'Password Reset!',
                    fullname,
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
}); // end .btnReset
 
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
 
 function load_systemuser(search){
   var position = Get_Parse_Session(Get_Session_Data()).position;
   
     $.ajax({
         url: "../api/users.php", method: "GET", dataType: "JSON",data: {action:"fetch",search:search},
         success: function(data){

             var string = JSON.stringify(data);
             var parse = JSON.parse(string);
             var dataRow = "<table><thead><tr>" +
                          "<th>#</th>" +
                          "<th>Employee ID</th>" +
                         "<th>Name of User</th>" +
                         "<th>Designation</th>" +
                         "<th>Address</th>" +
                         "<th>Email</th>" +
                         "<th>Contact No.</th>" +
                         "<th>Role</th>" +
                     "<th>Action</th>" +
                     "</tr></thead><tbody id='myTable'>";
                     var rowCount = parse.length;
 
       
                     var i=0;
 
                     while(i < rowCount){
                         var no = i + 1;       
                         var id = parse[i]['id'] ;
                         var employee_id = parse[i]['employee_id'] ;
                         var firstname = parse[i]['firstname'] ;
                         var lastname = parse[i]['lastname'];
                         var middlename = parse[i]['middlename'] ;
                         var extensionname = parse[i]['extensionname'];
                         var designation = parse[i]['designation'];
                         var fullname = parse[i]['fullname'];
                         var email = parse[i]['email'];
                         var address = parse[i]['address'];
                         var contactno = parse[i]['contactno'];
                         var role = parse[i]['position'];
                     
                         var tblRow = "<tr>";
                         tblRow += "<td>" + no + "</td>";
                         tblRow += "<td>" + employee_id + "</td>";
                         tblRow += "<td>" + fullname + "</td>";
                         tblRow += "<td>" + designation + "</td>";
                         tblRow += "<td>" + address + "</td>";
                         tblRow += "<td>" + email + "</td>";
                         tblRow += "<td>" + contactno + "</td>";
                         tblRow += "<td>" + role + "</td>";
                        
                         tblRow += "<td><button type='button' class='btn btn-primary btn-sm btnEdit' title='Edit Personnel' data-id='"+id+"' data-firstname='"+firstname+"' data-lastname='"+lastname+"' data-middlename='"+middlename+"' data-extensionname='"+extensionname+"' data-designation='"+designation+"' data-address='"+address+"' data-email='"+email+"' data-contactno='"+contactno+"' data-employee_id='"+employee_id+"' data-role='"+role+"'  data-toggle='modal' data-target='#userModal'><span class='fa fa-edit'></span></button> &nbsp;" +

                         "<button type='button' class='btn btn-danger btn-sm btnReset' title='Reset users password' data-id='"+id+"' data-fullname='"+fullname+"'  data-employee_id='"+employee_id+"' ><span class='fa fa-refresh'></span></button> &nbsp;";
 
                         //if administrator
                         if (position == "Administrator"){
                          // tblRow += "<button type='button' class='btn btn-danger btn-sm btnRemove' title='Remove Personnel' data-id='"+id+"' data-name='"+fullname+"'><span class='fa fa-remove'></span></button> &nbsp;";
                          }
 
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
 
 