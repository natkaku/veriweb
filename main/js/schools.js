$(document).ready(function(){
 
    Processing_Modal("Loading!");
    load_schools($("#txtSearch").val()); //load personnel record
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
   load_schools($("#txtSearch").val());
   Processing_Close(500);
   }); //cnd search button
 

 $(document).on("click",".btnEdit", function(){
     $("#btnSchoolSave").hide();
     $("#btnSchoolUpdate").show();
     $("#hidden_menu").val("edit");
     $("#addUserTitle").html("Update School");
     $("#hidden_id").val($(this).data("id"));
     $("#txtschool_id").val($(this).data("school_id"));
     $("#txtschool_name").val($(this).data("school_name"));
     $("#txtdistrict").val($(this).data("district"));
  
    $("#sh").html($(this).data("sh"));
    $("#h_sh").val($(this).data("sh_id"));

    $("#sup").html($(this).data("sup"));
    $("#h_sup").val($(this).data("sup_id"));
  


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
                     load_schools($("#txtSearch").val());
     
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
     var school_id = $("#txtschool_id").val();
     var school_name = $("#txtschool_name").val();
     var district = $("#txtdistrict").val();
    
     var sh_id = $("#h_sh").val();
     var sup_id = $("#h_sup").val();
    

     Processing_Modal("Processing!");
     $.ajax({
         url: "../api/schools.php", method:"POST",
         data: {action:menu, school_id:school_id,school_name:school_name,district:district,id:id,sh_id:sh_id,sup_id:sup_id},
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
             load_schools($("#txtSearch").val());
           Processing_Close(1000);
           }
           else if(data=="true"){
            var errorMessage = "School head already assigned!";
            Error_Message_SweetAlert(errorMessage); 
           }
           else{
             var errorMessage = "Unable to save/update data";
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
 
 function load_schools(search){
   //var position = Get_Parse_Session(Get_Session_Data()).position;
   
     $.ajax({
         url: "../api/schools.php", method: "GET", dataType: "JSON",data: {action:"fetch",search:search},
         success: function(data){
             var string = JSON.stringify(data);
             var parse = JSON.parse(string);
             var dataRow = "<table><thead><tr>" +
                          "<th>#</th>" +
                          "<th>School ID</th>" +
                         "<th>School Name</th>" +
                         "<th>District</th>" +
                         "<th>School Head</th>" +
                         "<th>Supervisor</th>" +
                     "<th>Action</th>" +
                     "</tr></thead><tbody id='myTable'>";
                     var rowCount = parse.length;
 
                     var i=0;
 
                     while(i < rowCount){
                         var no = i + 1;       
                         var id = parse[i]['id'] ;
                         var school_id = parse[i]['school_id'] ;
                         var school_name = parse[i]['school_name'] ;
                         var district = parse[i]['district'];
                         var sh = parse[i]['sh'];
                         var sup = parse[i]['sup'];

                         var sh_id = parse[i]['sh_id'];
                         var sup_id = parse[i]['sup_id'];
                 
                         var tblRow = "<tr>";
                         tblRow += "<td>" + no + "</td>";
                         tblRow += "<td>" + school_id + "</td>";
                          tblRow += "<td>" + school_name + "</td>";
                         tblRow += "<td>" + district + "</td>";
                         tblRow += "<td>" + sh + "</td>";
                         tblRow += "<td>" + sup + "</td>";
              
                        
                         tblRow += "<td><button type='button' class='btn btn-primary btn-sm btnEdit' title='Edit School Information' data-id='"+id+"' data-school_id='"+school_id+"' data-school_name='"+school_name+"' data-district='"+district+"'  data-sh='"+sh+"' data-sh_id='"+sh_id+"' data-sup='"+sup+"' data-sup_id='"+sup_id+"' data-toggle='modal' data-target='#userModal'><span class='fa fa-edit'></span></button> &nbsp;";
 
                             tblRow += "</td></tr>";
                             dataRow += tblRow;
                             i++;
                     }
 
                     dataRow += "</tbody></table>";
 
                     $("#userTable").html(dataRow);
                     document.getElementById("lblRecords").innerHTML = rowCount;
 
                     //paging
                  
 
         }
 
     });
 }

 function load_users(search){
  //var position = Get_Parse_Session(Get_Session_Data()).position;
  var code=  $("#hidden_code").val();
    $.ajax({
        url: "../api/schools.php", method: "GET", dataType: "JSON",data: {action:"fetch_users",search:search,code:code},
        success: function(data){
            var string = JSON.stringify(data);
            var parse = JSON.parse(string);
            var dataRow = "<table><thead><tr>" +
                         "<th>#</th>" +
                         "<th>Employee ID</th>" +
                        "<th>Employee Name</th>" +
                    "<th>Action</th>" +
                    "</tr></thead>";
                    var rowCount = parse.length;

                    var i=0;

                    while(i < rowCount){
                        var no = i + 1;       
                        var id = parse[i]['id'] ;
                        var employee_id = parse[i]['employee_id'] ;
                        var fullname = parse[i]['fullname'] ;
                                           
                        var tblRow = "<tr>";
                        tblRow += "<td>" + no + "</td>";
                        tblRow += "<td>" + employee_id + "</td>";              
                        tblRow += "<td>" + fullname + "</td>";
             
                        tblRow += "<td><button type='button' class='btn btn-success btn-sm btnAdd' title='Select' data-id='"+id+"' data-employee_id='"+employee_id+"' data-fullname='"+fullname+"'><span class='fa fa-plus'></span></button> &nbsp;";

                            tblRow += "</td></tr>";
                            dataRow += tblRow;
                            i++;
                    }

                    dataRow += "</table>";

                    $("#tbl_users").html(dataRow);
              

        }

    });
}


 $("#btn_sh").on("click", function(){
   $("#hidden_code").val($(this).data("code"));
   $("#staticBackdropLabel").html("Select School Head");
   load_users($("#txtSearchUser").val());
 }); //cnd search button

 $("#btn_sup").on("click", function(){
  $("#hidden_code").val($(this).data("code"));
  $("#staticBackdropLabel").html("Select Supervisor");
  load_users($("#txtSearchUser").val());
}); //cnd search button


$("#btnSearchButtonUser").on("click", function(){
 load_users($("#txtSearchUser").val());
}); //cnd search button
 
$(document).on("click",".btnAdd", function(){

      var code = $("#hidden_code").val();
      if(code=="sh") { $("#h_sh").val($(this).data("id")); $("#sh").html($(this).data("fullname"));}
      if(code=="sup") { $("#h_sup").val($(this).data("id")); $("#sup").html($(this).data("fullname"));}
  
      $("#staticBackdrop").modal("hide");
}); //.btnAdd

$("#btn_clear_sh").on("click", function(){
  $("#h_sh").val("0");
  $("#sh").html("");
}); //end button

$("#btn_clear_sup").on("click", function(){
  $("#h_sup").val("0");
  $("#sup").html("");
}); //end button