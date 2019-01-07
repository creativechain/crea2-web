$(document).ready(function(){

    let navbarC = $('#navbar-container');
    let navbarR = $('#navbar-right-menu');
    let navbarS = $('#navbar-search');
    let footer = $('footer');
    let welcome = $('.view-welcome');

    if (welcome.length > 0) {
        navbarC.addClass('hidden');
        navbarR.addClass('hidden');
        navbarS.addClass('hidden');
        footer.addClass('hidden');
    }

    $(".view-all").click(function(){
        $(this).addClass('active-view-all');
        $('.main-container').addClass('simple-view-home');
    });

    $(".active-view-all").click(function(){
        $(this).removeClass('active-view-all');
        $('.main-container').removeClass('simple-view-home')
    });
});


// With JQuery
$("#ex6").slider();
$("#ex6").on("slide", function(slideEvt) {
    $("#ex6SliderVal").text(slideEvt.value);
});
