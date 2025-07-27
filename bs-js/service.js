var domain = 'https://api.bizstarter.us'; // http://localhost:22239


$(document).ready(function () {

    let page_container = $('#bizstarter_services_container');
    
    if (page_container.length) {
        
        let page_id = getUrlValue('id');
        let partner_id = page_container.data('partnerid');


        let parse_url = document.location.href.split('/');


        if (page_id != false) {
            $.post(domain + '/pageapi/viewpageapi/', { 'pageId': page_id, 'partnerId': partner_id }, function (response) {
                page_container.html(response);
            }).then(function () {

                page_container.find('form').append('<input name="PartnerID" type="hidden" value="' + partner_id + '" />');

                $('.mask-date').mask('99 / 99 / 9999');
                $('.mask-phone').mask('999 999 9999');

                $('.action-scroll-form').on('click', function () {
                    let form = $('form');

                    if (form.length) {
                        $('html, body').animate({ scrollTop: form.offset().top }, 1000);
                    }
                });
                
                /*let url = $('#page_url').val();
                let current_domain = window.location.origin;

                window.history.replaceState({}, '', current_domain + '/additional-services/' + url + '/');*/
            });
        }


    }

});

function getUrlValue(key) {
    var p = window.location.search;
    p = p.match(new RegExp(key + '=([^&=]+)'));
    return p ? p[1] : false;
}

function getPageStatePrice1(e) {

    let stateId = $(e).val();
    let pageId = $(e).data('pageid');

    $.post(domain + '/pageapi/getpagestatepricebypageandstate/', { 'stateId': stateId, 'bizStarterPageId': pageId }, function (response) {
        $('#page_state_price').text(response);
        $('[name="Service_Price"]').val(response);
    });
}