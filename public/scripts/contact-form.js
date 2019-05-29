      $('#contact-submit').click(function() {
              $.ajax({
                  url: '/',
                  type:'POST',
                  data: {
                      name: $('#name').val(),
                      email: $('#email').val(),
                      message: $('#message').val(),
                  },
                  success: function(msg) {
                      alert('UserName Sent');
                  }               
              });

              $("#contact-form-fields").html("<div id='contact-thank-you'>Thank you for your inquiry. We'll respond as soon as possible.</div>")

          });


        $(document).scroll(function(){
          $("#contact-form").removeClass("active")        
        })

$("#contact-header").click(function(){
  $("#contact-form").toggleClass("active")
})


$("#name, #email, #message").keypress(function(){
  if (($('#name').val()) && ($('#email').val()) && ($('#message').val())) {
      $("#contact-submit").removeAttr('disabled');
  } else {
    $("#contact-submit").attr('disabled','disabled');
  }
})