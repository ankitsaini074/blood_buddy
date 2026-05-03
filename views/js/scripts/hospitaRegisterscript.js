function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-preview').innerHTML =
                '<img src="' + e.target.result + '" alt="Preview" class="w-full h-full object-cover">';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

$(document).ready(function(){
    //check duplicate usernammes
    $("#username").focusout(function() {
        var username=$("#username").val();
        console.log(username);

      if(username!=null)
      $.post( "/home/hospitalUsernameTest", { username: username }, function( data ) {
         // console.log("good hello");
       if(username==data.username)
       {
       showToast("Username already exists");
       $("#username").val("");
       }


       }, "json");
    });

    //confirms password..
         $( "#hospital-form" ).submit(function( event ) {
             // Check if profile picture is uploaded
             var profilePic = $("#profilePic")[0].files[0];
             if (!profilePic) {
                 showToast("Please upload a hospital logo");
                 event.preventDefault();
                 return;
             }

             var cpass=$("#confirmPassword").val();
             var pass=$("#password").val();
                 if (cpass != pass  )
                 {
                   showToast("Passwords do not match");
                   $("#password").val("");
                   $("#confirmPassword").val("");
                  event.preventDefault();
                  return;
                 }

                 // Check terms checkbox
                 if (!$("#terms").prop("checked")) {
                     showToast("Please accept Terms of Service");
                     event.preventDefault();
                     return;
                 }
         });


          //confirms password..edit
          $( "#_form" ).submit(function( event ) {
            var cpass=$("#_confirmPassword").val();
            var pass=$("#_password").val();
                if (cpass != pass  )
                {
                  showToast("Passwords do not match");
                  $("#_password").val("");
                  $("#_confirmPassword").val("");
                 event.preventDefault();
                }
        });

         //check duplicate email
         $("#email").focusout(function() {

            var email=$("#email").val();
            if(email!=null)
            $.post( "/home/hospitalEmailTest", { email: email }, function( data ) {
             if(email==data.email)
             {
             showToast("Email already registered");
             $("#email").val("");
             }

             }, "json");
          });

          // phone number
          $("#phoneNumber").focusout(function() {

            var phoneNumber=$("#phoneNumber").val();
            console.log(phoneNumber);
            if(phoneNumber.length!=10)
            showToast("Phone number must be 10 digits");
            for (let index = 0; index < phoneNumber.length; index++) {
                if(Number.isNaN(phoneNumber[index])==true)
               {
                   console.log(Number.isNaN(phoneNumber[index]));
                   showToast("Invalid phone number");
                   break;
               }

            }
        });

            // phone number  in edit
            $("#_phoneNumber").focusout(function() {

                var phoneNumber=$("#_phoneNumber").val();
                console.log(phoneNumber);
                if(phoneNumber.length!=10)
                showToast("Phone number must be 10 digits");
                for (let index = 0; index < phoneNumber.length; index++) {
                    if(Number.isNaN(phoneNumber[index])==true)
                   {
                       console.log(Number.isNaN(phoneNumber[index]));
                       showToast("Invalid phone number");
                       break;
                   }

                }
            });
});
