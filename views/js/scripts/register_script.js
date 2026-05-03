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

      if(username!=null)
      $.post( "/home/usernameTest", { username: username }, function( data ) {
       if(username==data.username)
       {
       showToast("Username already exists");
       $("#username").val("");
       }

       }, "json");
    });

    //confirms password..
         $( "#donor-form" ).submit(function( event ) {
             // Check if profile picture is uploaded
             var profilePic = $("#profilePic")[0].files[0];
             if (!profilePic) {
                 showToast("Please upload a profile picture");
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

                 // Check eligibility criteria - all 9 checkboxes must be checked
                 for (var i =1; i <= 9; i++) {
                     if (!$("#chk" + i).prop("checked")) {
                         console.log('Checkbox chk' + i + ' not checked');
                         showToast("Please accept all Eligibility Criteria");
                         event.preventDefault();
                         return;
                     }
                 }

                 // Check confirmation checkbox
                 if (!$("#chk10").prop("checked")) {
                     console.log('Confirmation checkbox not checked');
                     showToast("Please confirm eligibility criteria");
                     event.preventDefault();
                     return;
                 }

                 // Check terms checkbox
                 if (!$("#terms").prop("checked")) {
                     console.log('Terms checkbox not checked');
                     showToast("Please accept Terms of Service");
                     event.preventDefault();
                     return;
                 }

                 console.log('All validations passed, submitting form...');
         });
           //confirms password in edit..
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
            $.post( "/home/emailTest", { email: email }, function( data ) {
             if(email==data.email)
             {
             showToast("Email already registered");
             $("#email").val("");
             }

             }, "json");
          });

         //phone number check
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

        //phone number check in edit
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

        // register form eligiblity check
    $("#eligible_check").click(function(){
        console.log("hiii");
    var q1=$("#chk1"). prop("checked");
    var q2=$("#chk2"). prop("checked");
    var q3=$("#chk3"). prop("checked");
    var q4=$("#chk4"). prop("checked");
    var q5=$("#chk5"). prop("checked");
    var q6=$("#chk6"). prop("checked");
    var q7=$("#chk7"). prop("checked");
    var q8=$("#chk8"). prop("checked");
    var q9=$("#chk9"). prop("checked");

    if(q1==true && q2==true && q3==true && q4==true && q5==true && q6==true && q7==true && q8==true && q9==true)
    $("#chk10").prop("disabled",false);
    else
    $("#chk10").prop("disabled",true);
    });


    //edit form true eligiblity check
    $("#eligible_check_true").click(function(){
        console.log("hiii");
    var q1=$("#_chk1"). prop("checked");
    var q2=$("#_chk2"). prop("checked");
    var q3=$("#_chk3"). prop("checked");
    var q4=$("#_chk4"). prop("checked");
    var q5=$("#_chk5"). prop("checked");
    var q6=$("#_chk6"). prop("checked");
    var q7=$("#_chk7"). prop("checked");
    var q8=$("#_chk8"). prop("checked");
    var q9=$("#_chk9"). prop("checked");

    if(q1==true && q2==true && q3==true && q4==true && q5==true && q6==true && q7==true && q8==true && q9==true)
    $("#_chk10").prop("disabled",false);
    else
    $("#_chk10").prop("disabled",true);
    });


    //edit form false eligiblity check
    $("#eligible_check_false").click(function(){
        var q1=$("#check1"). prop("checked");
        var q2=$("#check2"). prop("checked");
        var q3=$("#check3"). prop("checked");
        var q4=$("#check4"). prop("checked");
        var q5=$("#check5"). prop("checked");
        var q6=$("#check6"). prop("checked");
        var q7=$("#check7"). prop("checked");
        var q8=$("#check8"). prop("checked");
        var q9=$("#check9"). prop("checked");

        if(q1==false || q2==false || q3==false || q4==false || q5==false || q6==false || q7==false || q8==false || q9==false)
        $("#check10").prop("disabled",false);
        else
        $("#check10").prop("disabled",true);
        });
});
