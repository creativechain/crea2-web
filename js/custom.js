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
});