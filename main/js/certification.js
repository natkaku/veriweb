$(document).ready(function(){
 
 });
 
 $('#cboSchoolYear').change(function() {
    Processing_Modal("Loading!");
      load_certification($(this).val()); //load personnel record
      Processing_Close(500);
  });

  //Filter the table
  $("#txtSearch").on("keyup", function() {
   var value = $(this).val().toLowerCase();
   $("#myTable tr").filter(function() {
     $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
   });
 });
 
 
 
 
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
 
 
 function load_certification(schoolyr){
 console.log(schoolyr);
     $.ajax({
         url: "../api/certification.php", method: "GET", dataType: "JSON",data: {action:"fetch",school_year:schoolyr},
         success: function(data){

             var string = JSON.stringify(data);
             var parse = JSON.parse(string);
             var dataRow = "<table><thead><tr>" +
                          "<th>#</th>" +
                          "<th>School ID</th>" +
                         "<th>School Name</th>" +
                         "<th>School Year</th>" +
                         "<th>Graduates/Completers of</th>" +
                     "<th>Status</th>" +
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
    
                         var school_head = parse[i]['school_head'];
                         var sds = parse[i]['sds'];
                         var is_submitted = parse[i]['is_submitted'];
                         var status = parse[i]['status'];
                    
                         var tblRow = "<tr>";
                         tblRow += "<td>" + no + "</td>";
                         tblRow += "<td>" + school_id + "</td>";
                         tblRow += "<td>" + school_name + "</td>";
                         tblRow += "<td>" + graduate_of + "</td>";
                         tblRow += "<td>" + school_year + "</td>";
                         tblRow += "<td>" + status + "</td>";
        
                             tblRow += "</tr>";
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