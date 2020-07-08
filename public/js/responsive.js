$(document).ready(function () {
    $('.dropdown').click(function () {
        if ($('.mobile-toggle').hasClass('hidden')) {
            $('.mobile-toggle').removeClass('hidden');
            $('.desktop-toggle').addClass('hidden');
        } else {
            $('.mobile-toggle').addClass('hidden');
            $('.desktop-toggle').removeClass('hidden');
        }
    })
    $(window).resize(function () {
        if ($(window).width() >= 769) {
            if ($('.desktop-toggle').hasClass('hidden')) {
                $('.desktop-toggle').removeClass('hidden');
            }
            if (!$('.mobile-toggle').hasClass('hidden')) {
                $('.mobile-toggle').addClass('hidden');
            }
        }
    });
})