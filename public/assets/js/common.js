// constants and functions used throughout the site from various jQuery scripts

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s/0-9]{5,20}$/;

// same set exists in /src/shared/constants.ts
const LOCALSTORAGE_USER_KEY = 'azbouki-user';
const LOCALSTORAGE_USER_TOKEN_KEY = 'azbouki-userToken';
const COOKIE_TOKEN_KEY = 'azboukiUserToken';

const DAYS_TO_REMEMBER_A_LOGGED_USER = 90;
const COMPANY_NAME_MIN_LENGTH = 2;
const PERSON_NAME_MIN_LENGTH = 2;
const PASSWORD_MIN_LENGTH = 8;
const COMPANY_ADDRESS_MIN_LENGTH = 10;
const MESSAGE_MIN_CHARACTERS = 30;

const submitError = $('#submit-error-msg');
const exclamationMark = '<span style="color: red;"><i class="fas fa-exclamation-triangle me-2"></i></span>';

const Roles = {
    Guest: 0,
    User: 1,
    Manager: 2,
    Admin: 99
}

function displayElement(selector, showErrorMessage) {
    if (showErrorMessage && selector.hasClass('d-none')) selector.removeClass('d-none');
    if (!showErrorMessage && !selector.hasClass('d-none')) selector.addClass('d-none');
}


// setting contents of the Information modal
function setInfoModalContents(text) {
    $('#jq-modal').html(`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="title-default-bold mb-none">ИНФОРМАЦИЯ</div>
                    <button type="button" class="close x-close" data-dismiss="modal">&times;</button>
                </div>
                <div id="registration-information" class="modal-body">
                    <p class="text-justify">${text}</p>
                    <div class="row">
                        <div class="col-12 my-5 text-center">
                            <button class="btn-fill close" data-dismiss="modal">ЗАТВОРИ</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
}

// Cookie operations
function processCookieConsent() {
    window.cookieconsent.initialise({
        'palette': {
            'popup': {
              'background': '#000'
            },
            'button': {
              'background': '#f1d600'
            }
        },
        'theme': 'classic',
        'position': 'bottom-left',
        content: {
            header: 'Бисквитки, използвани в страницата!',
            message: 'Използваме "бисквитки" (cookies), за да може сайтът да функционира правилно и да анализираме трафика си. Повече подробности относно политиката ни за "бисквитките" можете да прочетете',
            dismiss: '<div class="mx-5">Приемам<i class="fa fa-check ms-3" aria-hidden="true"></i></div>',
            allow: 'Allow cookies',
            deny: 'Decline',
            link: 'ТУК',
            href: '/cookies',
            close: '&#x274c;',
            policy: 'Cookie Policy',
            target: '_blank',
        }
    });
}

function setCookie(cname, cvalue, exdays) { //TODO: check if SECURE and SAMESITE cookie flags are needed
    if (exdays > 0) {
        let d = new Date();	
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));	
        let expires = "expires=" + d.toUTCString();	
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    } else {
        document.cookie = cname + "=" + cvalue + ";path=/"; // if exdays=0 - create a session cookie
    }
}

function getCookie(cname) {	
    let name = cname + "=";	
    let ca = document.cookie.split(';');	
    for (let i = 0; i < ca.length; i++) {	
        let c = ca[i];	
        while (c.charAt(0) == ' ') {	
            c = c.substring(1);	
        }	
        if (c.indexOf(name) == 0) {	
            return c.substring(name.length, c.length);	
        }	
    }	
    return "";	
}

function deleteCookie(cname) {
    document.cookie = cname  + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const privacyPolicyBoilerPlate = `
<div class="modal-dialog modal-dialog-scrollable modal-lg modal-gdpr" role="document">
    <div class="modal-content">
        <div class="modal-header d-flex flex-row align-items-center justify-content-between">
            <img src="/assets/images/logo.png" alt="FoodObox">
            <img src="/assets/images/gdpr.png" alt="Политика за поверителност">
        </div>
        <div class="modal-body text-justify">

            THE_AGREEMENT

        </div>
        <div class="modal-footer">
            <button id="gdpr-consent-btn" class="btn btn-success btn-block" data-dismiss="modal">ПРИЕМАМ ВСИЧКИ</button>
        </div>
    </div>
</div>
`;

const TOSBusinessBoilerPlate = `
<div class="modal-dialog modal-dialog-scrollable modal-lg modal-gdpr">
    <div class="modal-content">
        <div class="modal-header d-flex flex-row align-items-center justify-content-between">
            <img src="/assets/images/logo.png" alt="FoodObox">
        </div>
        <div class="modal-body text-justify">
            
            THE_TERMS
            
        </div>
        <div class="modal-footer">
            <button id="tos-business-close" class="btn btn-success btn-block" data-dismiss="modal">ЗАТВОРИ</button>
        </div>
    </div>
</div>
`;