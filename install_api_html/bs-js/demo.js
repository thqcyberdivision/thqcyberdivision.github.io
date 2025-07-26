


$(document).ready(function () {

    $('.menu-item').hover(
        function () {
            $(this).parent().find('.menu-chevron').addClass('menu-chevron-rotate');
            $(this).parent().addClass('dropdown-menu-active');
        }
    );

    $('nav > div').hover(function () { },
        function () {
            $(this).find('.menu-chevron').removeClass('menu-chevron-rotate');
            $(this).removeClass('dropdown-menu-active');
        }
    );


    if ($('#dropdown_menu').length) {
        $.post('https://api.bizstarter.us/api/buildservicemenu/', function(response) {
            $('#dropdown_menu').html(response);
            $('#mobile_menu').html(response);
        });
    }



    $('.burger').on('click', function () {
        $('.mobile-menu').fadeIn();
    });

    $('.mobile-menu_close img').on('click', function () {
        $('.mobile-menu').fadeOut();
    });


    if ($('#bizstarter_addinional-services-container').length) {
        $.post('https://api.bizstarter.us/setting/getsettingbyid/?id=1', function (response) {
            $('#bizstarter_addinional-services-container').html(response);
        });
    }

    if ($('#bizstarter_page_container').length) {
        let page_id = getUrlValue('page_id');

        if (page_id != '') {
            $.post('https://api.bizstarter.us/setting/getsettingbyid/?id=' + page_id, function (response) {
                $('#bizstarter_page_container').html(response);
            });
        }
    }

});


