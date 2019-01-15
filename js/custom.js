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

    $("#view-changer").click(function(){
        $(this).toggleClass('active-view-all');
        $(this).toggleClass('img-view-all');
        $('.main-container').toggleClass('simple-view-home');
        $('.masonry__item').toggleClass('row-simple-view');
    });
});


// With JQuery
$("#ex6").slider();
$("#ex6").on("slide", function(slideEvt) {
    $("#ex6SliderVal").text(slideEvt.value);
});
