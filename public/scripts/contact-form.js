
$("body").append("<div id='contact-form' class='active'><div id='contact-header'>Contact Us<div class='contact-control'></div></div><div id='contact-form-fields'><input id='name' name='name' type='text' placeholder='Your name' required='required'><input id='email' name='email' type='text' placeholder='Your email' required='required'><textarea id='message' name='message' placeholder='Enter your message here' rows='3' required='required'></textarea><button id='contact-submit' class='button' disabled>Submit</button></div></div>");



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


$("#name, #email, #message").bind('input',function(){

  if (($('#name').val()) && ($('#email').val()) && ($('#message').val())) {
      $("#contact-submit").removeAttr('disabled');
  } else {
    $("#contact-submit").attr('disabled','disabled');
  }
})



