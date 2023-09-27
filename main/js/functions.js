// Processing_Modal("Processing!");
Processing_Modal = (action) =>{
    Swal.fire({ title: action, html: 'Please wait..',allowOutsideClick: false,onBeforeOpen: () => { Swal.showLoading() }, });
}
// Processing_Close(1000);
Processing_Close = (timeout) =>{
    setTimeout(function(){ swal.close(); }, timeout);
}
// Error_Message_SweetAlert(errorMessage);
Error_Message_SweetAlert = (errorMessage) =>{
    Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: 'Something went wrong! ' + errorMessage
      }) 
}


//control privileges
function nav_controls(){
    $.ajax({
           url: "../scripts/session.php",
           method: "POST",
           dataType: "JSON",
           error: function(){
               window.location.replace("../index.html");
           },
           success: function(data){
               var position;
              position = data.position;
          
              if (position != "Administrator" ){
               $("#user").hide();
               }
           
           }
       });
 $("#username").html("") //display the name of user
}

function get_user_id(){
  
   return $.ajax({
          url: "../api/session.php",
          async: false
         
      }).responseText;
   
}

function systemDate(){
   var now = new Date();
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear()+"-"+(month)+"-"+(day) ;

  return today;
} 


//load window of current user
function load_window(){
    $.ajax({
      url: "../api/session.php",
      method: "POST",
      dataType: "JSON",
      error: function(){
     
          window.location.replace("../index.html");
      },
      success: function(data){
        $("#school_name").html('<strong>' + data.school_id + '</strong> ' + data.school_name);
        $("#school_head").html(data.fullname);

        if(data.position!="Administrator"){
            $("#user").hide();
            $("#schools").hide();
            $("#diploma").hide();
            $("#verification").hide();
            $("#certification").hide();
        }

        if(data.position=="Supervisor"){
            $("#verification").show();
        }

        if(data.position=="School Head"){
            $("#diploma").show();
        }
        if(data.position=="Administrator"){
            $("#diploma").hide();
        }
     
    
          }
    });
  }

  Get_Session_Data = () =>{
    
    return $.ajax({  url: "../api/session.php",
    method: "GET",
    dataType:"JSON",
    async:false
     }).responseText;
  
 }

 Get_Parse_Session = (data) =>{
    var parse = JSON.parse(data);
    return parse;
}


Get_Schools = () =>{
    return $.ajax({ url: "../api/disbursement.php", method: "GET",data:{action:"fetch_school"},
     success: function (data){
     }, async: false
     }).responseText;
  
 }

 Stringify_DataList = (data) =>{
    var parse = JSON.parse(data);
    var rowCount = parse.length;
    var str ="";
   
    for(var i=0; i<rowCount;i++){
          str += "<option value='" + parse[i]["retrievedata"] + "'>" + parse[i]["retrievedata"] + "</option>";          
    }
    return str;
}

Stringify_Select = (data) =>{
    var parse = JSON.parse(data);
    var rowCount = parse.length;
    var str =" <option value selected disabled>Select</option>";
   
    for(var i=0; i<rowCount;i++){
          str += "<option value='" + parse[i]["id"] + "'>" + parse[i]["retrievedata"] + "</option>";          
    }
    return str;
}
  