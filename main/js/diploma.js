let sy = "2022-2023";
$(document).ready(function(){
  Processing_Modal("Loading!");
  load_certfication(sy); //load personnel record
  Processing_Close(500);
    
 });
 
 $('#cboSchoolYear').change(function() {
  Processing_Modal("Loading!");
    load_certfication($(this).val()); //load personnel record
    Processing_Close(500);
});

  //Filter the table
  $(document).on("keyup",".txtSearch", function(){
   var value = $(this).val().toLowerCase();
   var cert_id = $(this).data("cert_id");
   $("#myTable"+cert_id+" tr").filter(function() {
     $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
   });
 });
 

  $("#btnAdd").on("click", function(){
   $("#btnUserSave").show();
   $("#btnUserUpdate").hide();
   $("#hidden_menu").val("add");
   $("#addUserTitle").html("Add Certification");
   clear_content();
 }); //end btnAdd
 
 $(document).on("click",".btnEdit", function(){
     $("#btnUserSave").hide();
     $("#btnUserUpdate").show();
     $("#hidden_menu").val("edit");
     $("#addUserTitle").html("Edit Certification Details");
     $("#hidden_id").val($(this).data("id"));
     $("#cboschoolyear").val($(this).data("school_year"));
     $("#cbograduateof").val($(this).data("graduate_of"));
     $("#dtpdate").val($(this).data("graduation_date"));
     $("#txtvenue").val($(this).data("graduation_venue"));
     $("#txtschoolhead").val($(this).data("school_head"));
     $("#cbosds").val($(this).data("sds"));
   
 }); //.btnEdit
 
 $(document).on("click",".btnDeleteGraduate", function(){
   var id = $(this).data("id");
   var personnel_name = $(this).data("fullname");
   var cert_id = $(this).data("cert_id");
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
               url: "../api/diploma.php", method: "POST", data: {id:id, action:"delete_graduate",fullname:personnel_name},success:function(data){
      
                 if(data=="success") {
                   Swal.fire(
                     'Deleted!',
                     personnel_name + ' removed.',
                     'success'
                     )
                 
                     var dataTable=extract_graduates(fetch_graduates(cert_id),cert_id,0);
                     $("#tablecert"+cert_id).html(dataTable);
                     Processing_Close(1000);
     
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
     var school_year = $("#cboschoolyear").val();
     var graduate_of = $("#cbograduateof").val();
     var graduation_date = $("#dtpdate").val();
     var graduation_venue = $("#txtvenue").val();
     var school_head = $("#txtschoolhead").val();
     var sds = $("#cbosds").val();
    
     Processing_Modal("Processing!");
     $.ajax({
         url: "../api/diploma.php", method:"POST",
         data: {action:menu, school_year:school_year,graduate_of:graduate_of,graduation_date:graduation_date,graduation_venue:graduation_venue,school_head:school_head,sds:sds,id:id},
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
             load_certfication($("#choSchoolYear").val());
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
   $("#cboschoolyear").val("");
     $("#cbograduateof").val("");
     $("#dtpdate").val("");
     $("#txtvenue").val("");
     $("#txtschoolhead").val("");
     $("#cbosds").val("");
 
 }

 function load_certfication(schoolyr){

     $.ajax({
         url: "../api/diploma.php", method: "GET", dataType: "JSON",data: {action:"fetch",sy:schoolyr},
         success: function(data){

             var string = JSON.stringify(data);
             var parse = JSON.parse(string);
             var htmldata="";
      
             for(var i=0;i<parse.length;i++){
                var id = parse[i]['id'];
                var school_year = parse[i]['school_year'];
                var graduate_of = parse[i]['graduate_of'];
                var graduation_date = parse[i]['graduation_date'];
                var date = new Date(graduation_date); // Get the current date
               var formattedDate = date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });

                var graduation_venue = parse[i]['graduation_venue'];
                var school_head = parse[i]['school_head'];
                var sds = parse[i]['sds'];
                var sch_id = parse[i]['sch_id'];
                var qr_id = parse[i]['qr_id'];
                var cert_id = parse[i]['id'];
           var is_expanded = (i==0) ? "true":"false";
                var btn_color = button_color(i);
              var is_submitted =  parse[i]['is_submitted'];

              var button_data = (is_submitted==1)?  " <input class='form-control pull-right txtSearch' type='search' placeholder='Search by Name' aria-label='Search' style='width: 250px; margin-right: 10px;' data-cert_id='"+cert_id+"'>" +
              "<br><br> <hr/>" : "<button data-toggle='modal' data-target='#userModal' class='btn btn-secondary btnEdit pull-left' title='Edit Certification Details' data-id='"+id+"' data-school_year='"+school_year+"' data-graduate_of='"+graduate_of+"' data-graduation_date='"+graduation_date+"' data-graduation_venue='"+graduation_venue+"' data-school_head='"+school_head+"' data-sds='"+sds+"' data-sch_id='"+sch_id+"' > <span class='fa fa-edit'></span> Edit Certification</button> " +
              "<a class='btn btn-warning btnEdit pull-left' title='Download QR Code'  href='../download/qr_code_"+qr_id+".png' download> <span class='fa fa-qrcode'></span> Download</a>" +
              " <button data-toggle='modal' data-target='#graduateModal' class='btn btn-success pull-right btnAddGraduate' title='Add Graduate' data-cert_id='"+cert_id+"'> <span class='fa fa-plus'></span> Add Graduate</button>" +
              " <input class='form-control pull-right txtSearch' type='search' placeholder='Search by Name' aria-label='Search' style='width: 250px; margin-right: 10px;'  data-cert_id='"+cert_id+"'>" +
              "<br><br> <hr/>";

                var dataTable=extract_graduates(fetch_graduates(id),id,is_submitted);

                var submitButton = (is_submitted==0) ? "<button class='btn btn-primary pull-right btnSubmit' title='Submit for verification' data-cert_id='"+cert_id+"' data-school_year='"+school_year+"' data-graduate_of='"+graduate_of+"'> <span class='fa fa-paper-plane'></span> Submit for Verification</button>":"";

               htmldata += "<div class='card'>" +
                "<div class='card-header' id='heading" +cert_id+"'>" +
                " <h1 class='mb-0'>" +
                " <button class='btn btn-block text-left "+btn_color+"' type='button' data-toggle='collapse' data-target='#cert"+cert_id+"' aria-expanded='"+is_expanded+"' aria-controls='collapse"+cert_id+"' id='btncert"+cert_id+"'> SY: "+school_year+" "+graduate_of+" <span class='pull-right'>Graduation Date: "+formattedDate+"</span> </button>" +
                " </h1>" +
                " </div>" +
                " <div id='cert"+cert_id+"' class='collapse show' aria-labelledby='heading"+cert_id+"' data-parent='#accordionCert'>" +
                "<div class='card-body'>" +
                button_data +
                " <div class='row table-responsive'>" +
                "<table class='table table-striped table-bordered table-sm' id='tablecert"+cert_id+"'>"+dataTable+" </table>" +
                "</div>" +
                submitButton +
                " </div>" +
                " </div>" +
                "</div>";

             
             }

           $("#accordionCert").html(htmldata);
        
 
         }
        
     });
   

 }

 function fetch_graduates(cert_id){
    
      return  $.ajax({
            url: "../api/diploma.php", method: "GET", dataType: "JSON",data: {action:"fetch_graduates",cert_id:cert_id},async:false
        }).responseText;
 
 }

 function extract_graduates(adata,c_id,is_submitted){
   
        var parse1 = JSON.parse(adata);

        var dataRow = "<thead><tr>" +
        "<th>#</th>" +
        "<th>LRN</th>" +
       "<th>Name of Graduates</th>" +
       "<th>Sex</th>";
       if (is_submitted==0){dataRow +="<th>Action</th>"; }else{dataRow +="<th>Status</th>";}
      dataRow += "</tr></thead><tbody id='myTable"+c_id+"'>";
   var rowCount = parse1.length;
   var x=0;

   while(x < rowCount){
       var no = x + 1;       
       var sid = parse1[x]['id'];
       var lrn = parse1[x]['lrn'];
       var fullname = parse1[x]['fullname'];
       var lastname = parse1[x]['lastname'];
       var firstname = parse1[x]['firstname'];
       var middlename = parse1[x]['middlename'];
       var extensionname = parse1[x]['extensionname'];
       var sex = parse1[x]['sex'];
       var birthdate = parse1[x]['birthdate'];
       var cert_id = parse1[x]['cert_id'];
       var is_validated = parse1[x]['is_validated'];
 
       var tblRow = "<tr>";
       tblRow += "<td>" + no + "</td>";
       tblRow += "<td>" + lrn + "</td>";
       tblRow += "<td>" + fullname + "</td>";
       tblRow += "<td>" + sex + "</td>";
      
       if(is_submitted==0){ tblRow += "<td><button type='button' class='btn btn-primary btn-sm btnEditGraduate' title='Edit Graduate' data-id='"+sid+"' data-lrn='"+lrn+"' data-lastname='"+lastname+"' data-firstname='"+firstname+"' data-middlename='"+middlename+"' data-extensionname='"+extensionname+"' data-sex='"+sex+"' data-birthdate='"+birthdate+"' data-cert_id='"+cert_id+"' data-toggle='modal' data-target='#graduateModal'><span class='fa fa-edit'></span></button> &nbsp;";
       tblRow += "<button type='button' class='btn btn-danger btn-sm btnDeleteGraduate' title='Delete Graduate' data-id='"+sid+"' data-fullname='"+fullname+"' data-cert_id='"+cert_id+"'><span class='fa fa-trash'></span></button> &nbsp;";}
       else{
        tblRow += (is_validated==0) ? "<td><span class='badge badge-secondary'>Not yet verified</span>":"<td><span class='badge badge-success'>Verified</span>";
       }
      

           tblRow += "</td></tr>";
           dataRow += tblRow;
           x++;
   }

dataRow += "</tbody>";
return dataRow;
    
 }



 function button_color(number){
    var num = number%4;
    var btn_color="";
    switch (num){
        case 0: 
        btn_color="btn-info";
        break;
        case 1: 
        btn_color= "btn-primary";
        break;
        case 2: 
        btn_color="btn-secondary";
        break;
        default: 
        btn_color="btn-warning";
    }
    return btn_color;
 }

 $(document).on("click",".btnAddGraduate", function(){
  $("#btnGraduateSave").show();
  $("#btnGraduateUpdate").hide();
  $("#hidden_menu").val("add_graduate");
  $("#graduateTitle").html("Add New Graduate");
  $("#txtlrn").val("");
  $("#txtlastname").val("");
  $("#txtfirstname").val("");
  $("#txtmiddlename").val("");
  $("#txtextension").val("");
  $("#dtpbirthdate").val("");
  $("#cbosex").val("");

  $("#hidden_cert_id").val($(this).data("cert_id"));

}); //.btnAddGraduate

$("#graduate_add").on("submit",function(event){
  event.preventDefault();
  var menu = $("#hidden_menu").val();
  var id = $("#hidden_id").val();
  var cert_id = $("#hidden_cert_id").val();
  var lrn = $("#txtlrn").val();
  var lastname = $("#txtlastname").val();
  var firstname = $("#txtfirstname").val();
  var middlename = $("#txtmiddlename").val();
  var extensionname = $("#txtextension").val();
  var birthdate = $("#dtpbirthdate").val();
  var sex = $("#cbosex").val();
 
  Processing_Modal("Processing!");
  $.ajax({
      url: "../api/diploma.php", method:"POST",
      data: {action:menu, lastname:lastname,firstname:firstname,middlename:middlename,extensionname:extensionname,birthdate:birthdate,sex:sex,lrn:lrn,cert_id:cert_id,id:id},
      success: function(data){   

        if(data=="success"){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: (menu=="add") ? 'Record Saved!':'Record Update',
            showConfirmButton: false,
            timer: 1500
          })
          $("#graduateModal").modal("hide");
          var dataTable=extract_graduates(fetch_graduates(cert_id),cert_id,0);
          $("#tablecert"+cert_id).html(dataTable);
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

$(document).on("click",".btnSubmit", function(){
  var cert_id = $(this).data("cert_id");
  var school_year = $(this).data("school_year");
  var graduate_of = $(this).data("graduate_of");
  Swal.fire({
      title: 'Submit for verification?',
      text: 'SY: '  + school_year + ' Graduates of '+graduate_of,
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
              url: "../api/diploma.php", method: "POST", data: {cert_id:cert_id, action:"submit_graduate",school_year:school_year,graduate_of:graduate_of},success:function(data){
     
                if(data=="success") {
                  Swal.fire(
                    'Submitted!',
                    'SY: '  + school_year + ' Graduates of '+graduate_of,
                    'success'
                    )
                
                    load_certfication(school_year);
                    Processing_Close(1000);
    
                } 
              
              },error: function(xhr, status, error){
                  var errorMessage = xhr.status + ': ' + xhr.statusText 
              Swal.fire({icon: 'error',title: 'Error....',text: 'No network connection!'}) 
              }
          });

         
      }
      })
}); // end .btnSubmit

$(document).on("click",".btnEditGraduate", function(){
  $("#btnGraduateSave").hide();
  $("#btnGraduateUpdate").show();
  $("#hidden_menu").val("edit_graduate");
  $("#graduateTitle").html("Edit Graduate/Completer");
  $("#hidden_id").val($(this).data("id"));
  $("#hidden_cert_id").val($(this).data("cert_id"));
  $("#txtlrn").val($(this).data("lrn"));
  $("#txtlastname").val($(this).data("lastname"));
  $("#txtfirstname").val($(this).data("firstname"));
  $("#txtmiddlename").val($(this).data("middlename"));
  $("#txtextension").val($(this).data("extensionname"));
  $("#dtpbirthdate").val($(this).data("birthdate"));
  $("#cbosex").val($(this).data("sex"));

}); //.btnEditgRADUATE
