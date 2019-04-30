"use strict";

$(document).ready(function () {
    var navbarC = $('#navbar-container');
    var navbarR = $('#navbar-right-menu');
    var navbarS = $('#navbar-search');
    var footer = $('footer');
    var welcome = $('.view-welcome');

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


    $("#more-info-profile").toggleClass('d-none');


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
}); // With JQuery

$("#ex6").slider();
$("#ex6").on("slide", function (slideEvt) {
    $("#ex6SliderVal").text(slideEvt.value);
});