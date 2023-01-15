/*************************************************
                Animation During Scroll
**************************************************/
$(function () {

    //animate during scroll
    new WOW().init();
});
/********************************************
                TESTIMONIALS
********************************************/
$(function () {
    $("#customers-testimonials").owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayHoverPause: true,
        smartSpeed: 1000
    });
});
/******************************************
            ADD CLASS 
*******************************************/

$(window).scroll(function() {
  if($(this).scrollTop() > 100) 
  {
    $('.nav-transparent').addClass('nav-color');
    
  } else {
    $('.nav-transparent').removeClass('nav-color');
  }
});
//
//$(document).ready(function () {
//
//  $("#user-profile-link").click(function () {
//
//    $('head').append('<link rel="stylesheet" href="../css/user-profile-animation.css" type="text/css" />');
//
//  });
//
//});
/********************************************
                STATS
********************************************/
$(function(){
    $('.counter').counterUp({
        delay:10,
        time:1500
    })
});

