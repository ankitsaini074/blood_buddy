$(document).ready(function(){
    //check duplicate usernammes
    $("#username").focusout(function() {
        var username=$( "#username" ).val();
        console.log(username);

      if(username!=null)
      $.post( "/home/usernameTest", { username: username }, function( data ) {
         // console.log("hello");
       if(username==data.username)
       {
       alert("user alredy exists");
       $( "#username" ).val("");
       } 
     
       }, "json");
    });

    //confirms password..
         $( "#form" ).submit(function( event ) {
             var cpass=$( "#confirmPassword" ).val();
             var pass=$( "#password" ).val();
                 if (cpass != pass  ) 
                 {
                   alert("password do not match");
                   $( "#password" ).val("");
                   $( "#confirmPassword" ).val("");
                  event.preventDefault();
                 }
         });
           //confirms password in edit..
           $( "#_form" ).submit(function( event ) {
            var cpass=$( "#_confirmPassword" ).val();
            var pass=$( "#_password" ).val();
                if (cpass != pass  ) 
                {
                  alert("password do not match");
                  $( "#_password" ).val("");
                  $( "#_confirmPassword" ).val("");
                 event.preventDefault();
                }
        });

         //check duplicate email
         $("#email").focusout(function() {

            var email=$( "#email" ).val();
            if(email!=null)
            $.post( "/home/emailTest", { email: email }, function( data ) {
             if(email==data.email)
             {
             alert("email alredy rgistered");
             $( "#email" ).val("");
             } 
           
             }, "json");
          });
         
         //phone number check 
          $("#phoneNumber").focusout(function() {

            var phoneNumber=$( "#phoneNumber" ).val();
            console.log(phoneNumber);
            if(phoneNumber.length!=10)
            alert("invalid numbers");
            for (let index = 0; index < phoneNumber.length; index++) {
                if(Number.isNaN(phoneNumber[index])==true)
               { 
                   console.log(Number.isNaN(phoneNumber[index]));
                   alert("invalid number");
                   break;
               }
                
            }
        });
        
        //phone number check in edit 
        $("#_phoneNumber").focusout(function() {

            var phoneNumber=$( "#_phoneNumber" ).val();
            console.log(phoneNumber);
            if(phoneNumber.length!=10)
            alert("invalid numbers");
            for (let index = 0; index < phoneNumber.length; index++) {
                if(Number.isNaN(phoneNumber[index])==true)
               { 
                   console.log(Number.isNaN(phoneNumber[index]));
                   alert("invalid number");
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