"use strict";

$(document).ready(function () {
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

    $("#view-changer").click(function () {
        $(this).toggleClass('active-view-all');
        $(this).toggleClass('img-view-all');
        $('.main-container').toggleClass('simple-view-home');
        $('.masonry__item').toggleClass('row-simple-view');
    });
    $(window).resize(function () {
        if ($(window).width() < 991) {
            $('#more-info-profile').addClass('d-none');
        } else {
            $('#more-info-profile').removeClass('d-none');
        }
    });




    $(".btn-more-info-profile").click(function () {
        $('.btn-more-info-profile').addClass('hidden');
        $('.btn-hidden-info-profile').removeClass('hidden');
        $('#more-info-profile').toggleClass('d-none');
    });
    $(".btn-hidden-info-profile").click(function () {
        $('.btn-more-info-profile').removeClass('hidden');
        $('.btn-hidden-info-profile').addClass('hidden');
        $('#more-info-profile').toggleClass('d-none');
    });




    $("input[type=text], input[type=password], textarea").on({ 'touchstart' : function() {
            zoomDisable();
        }});
    $("input[type=text], input[type=password], textarea").on({ 'touchend' : function() {
            setTimeout(zoomEnable, 500);
        }});

    function zoomDisable(){
        $('head meta[name=viewport]').remove();
        $('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0" />');
    }
    function zoomEnable(){
        $('head meta[name=viewport]').remove();
        $('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=1" />');
    }

/*    //efect recommended
    $( ".card__top" ).hover(
        function() {
            $(this).children( '.row-circle-recommended' ).removeClass('hidden');
        }, function() {
            $(this).children( ".row-circle-recommended" ).addClass('hidden');
        }
    );*/


}); // With JQuery

$("#ex6").slider();
$("#ex6").on("slide", function (slideEvt) {
    $("#ex6SliderVal").text(slideEvt.value);
});