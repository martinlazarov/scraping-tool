// for functions and vars used in this script, please refer to ./common.js

jQuery(window).on('load', function () {

    let modalIsOpen = false;

    $.urlParam = function (params) {
        const results = new RegExp('[\?&]' + params + '=([^&#]*)').exec(window.location.search);
        return (results !== null) ? results[1] || null : null;
    }

    if ($.urlParam('action')) { // if 'action' URL param exists - start User registration activation

        let apiEndpoint; // for User or for Manager/Admin api endpoints
        let redirectURL; // where the user/manager will be redirected after the modal closure
        let msgActivated; // greeting modal message informing user/manager for successful activation
        modalIsOpen = true;

        const role = JSON.parse($.urlParam('type'));

        switch (role){
            case Roles.User:
                apiEndpoint = '/user/register';
                redirectURL = window.location.origin;
                msgActivated = `<br>${checkMark} <strong>Профилът ти е активиран успешно!</strong><br><br>
                                Вече можеш да влезеш в приложението и да разгледаш офертите на 
                                любимите ти заведения и магазини около теб!<br><br>
                                Очакваме те!`;
                break;
            case Roles.Manager:
            case Roles.Admin:
                apiEndpoint = '/company/register';
                redirectURL = window.location.origin + '/login';
                msgActivated = `<br>${checkMark} <strong>Профилът ти е активиран успешно!</strong><br><br>
                                Вече можеш да влезеш в платформата и да започнем заедно да спасяваме храна!<br><br>`;
        }
        
        $.ajax({
            url: apiPrefix + apiEndpoint,
            type: 'GET',
            data: {
                registrationActivationToken: $.urlParam('action')
            }
        })
        .done(function(response) {
            response.success    ? setInfoModalContents(msgActivated) 
                                : setInfoModalContents(`<br>${exclamationMark}${response.msg || response.message || 'Възникна грешка!'}<br><br>`);
        })
        .fail(function(err) {
            const errorMessage = err.responseJSON.message || 'Възникна грешка!';
            setInfoModalContents(`<br>${exclamationMark}${errorMessage}<br><br>`);
        })
        .always(function(){
            $('#jq-modal').css({ backgroundColor: '#000000bb' }).modal('show');
            $('#jq-modal').on('hidden.bs.modal', function (e) {
                window.location.href = redirectURL;
            });
        });
        
    }
    
    // const gdprAgreement = JSON.parse(localStorage.getItem('gdpr-agree-with-terms'));

    // // Check if user has accepted the GDPR policy
    // if (!gdprAgreement && !modalIsOpen) {

    //     $.get('/assets/policies/privacy-policy')
    //         .done((theAgreement) => {
                
    //             const modalWindow = $('#jq-modal');
    //             const modalGDPR = $('#jq-modal .modal-gdpr');
    //             modalWindow.css({
    //                 backgroundColor: '#000000bb'
    //             });
    //             const privacyAgreement = privacyPolicyBoilerPlate.replace(/THE_AGREEMENT/g, theAgreement);
    //             modalWindow.html(privacyAgreement);

    //             modalWindow.modal({backdrop: 'static', keyboard: false});
    //             modalWindow.modal('show');

    //             $('#gdpr-consent-btn').click(function() {
    //                 modalGDPR.modal('hide');
    //                 localStorage.setItem('gdpr-agree-with-terms', 'true')
    //                 processCookieConsent();
    //             });
    //         });
            
    // } else {
    //     processCookieConsent();
    // }

    // $('#tos-business').click((evt) => {
    //     evt.preventDefault();
    //     $.get('/assets/policies/terms-of-service-business.ejs')
    //         .done((theTerms) => {
    //             const modalWindowTOS = $('#jq-modal');
    //             const modalTOS = $('#jq-modal .modal-gdpr');
    //             const termsOfService = TOSBusinessBoilerPlate.replace(/THE_TERMS/g, theTerms)
    //             modalWindowTOS.html(termsOfService);
    //             modalWindowTOS.modal('show');

    //             $('#tos-business-close').click(function() {
    //                 modalTOS.modal('hide');
    //             });
    //         });
    // });

    $('#logout').on('click', () => {
        if (confirm('Сигурни ли сте, че искате да излезнете от системата?')) {
            deleteCookie(COOKIE_TOKEN_KEY);
            localStorage.removeItem(LOCALSTORAGE_USER_TOKEN_KEY);
            localStorage.removeItem(LOCALSTORAGE_USER_KEY);
            window.location.href = "/login";
        }
    });
});
