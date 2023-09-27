$(function() {
    // Define the routes
    var routes = {
      '#': 'Main',
      '#user': 'User',
      '#schools': 'Schools',
      '#diploma': 'Diploma',
      '#changepassword': 'ChangePassword',
      '#verification': 'Verification',
      '#certification': 'Certification_Admin'
    };
  
    // Set up the event listener
    $(window).on('hashchange', function() {
      // Get the current hash value
      var hash = window.location.hash;
  
      // Handle the route
      if (routes[hash]==="User") {
        $.get('components/users.html', function(data) {
            // Store the HTML content in a variable
            var htmlContent = data;

            // Display the HTML content in the console
            $('#main-page').html(htmlContent);
            $('#modals').html("");

          });
      } 
      else if (routes[hash]==="Schools") {
        $.get('components/schools.html', function(data) {
            var htmlContent = data;
            $('#main-page').html(htmlContent);
            $('#modals').html("");

          });
      } 
      else if (routes[hash]==="ChangePassword") {
        $.get('components/changepassword.html', function(data) {
            var htmlContent = data;
            $('#main-page').html(htmlContent);
            $('#modals').html("");

          });
      } 

      else if (routes[hash]==="Diploma") {
        $.get('components/diploma.html', function(data) {
            var htmlContent = data;
            $('#main-page').html(htmlContent);
            $('#modals').html("");

          });
      } 
      else if (routes[hash]==="Verification") {
        $.get('components/verification.html', function(data) {
            var htmlContent = data;
            $('#main-page').html(htmlContent);
            $('#modals').html("");

          });
      } 

      else if (routes[hash]==="Certification_Admin") {
        $.get('components/certification.html', function(data) {
            var htmlContent = data;
            $('#main-page').html(htmlContent);
            $('#modals').html("");

          });
      } 
   
      
      else {
    
          $('#main-page').html("");
          $('#modals').html("");
        
      }
    });
  
    // Set the initial route
    $(window).trigger('hashchange');
  });
  