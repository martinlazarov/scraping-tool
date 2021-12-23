// for functions and vars used in this script, please refer to ./common.js

jQuery(window).on('load', function () {

    const apiPrefix = document.querySelector('#jq-login-form').dataset.apiPrefix;
    console.log(apiPrefix)
    const username = $('#username');
    const usernameErr = username.parent().siblings('.validation-text');
    const password = $('#password');
    const passwordErr = password.parent().siblings('.validation-text');

    username.on('input', function(){
        displayElement(usernameErr, false);
        username.val().length > 0 ? username.siblings('.jq-icon').addClass('populated') : username.siblings('.jq-icon').removeClass('populated');
    });

    password.on('input', function(){
        displayElement(passwordErr, false);
        password.val().length > 0 ? password.siblings('.jq-icon').addClass('populated') : password.siblings('.jq-icon').removeClass('populated');
    });

    $('#jq-login-form').on('submit', function(evt){
        evt.preventDefault();
        displayElement(usernameErr, false);
        displayElement(passwordErr, false);
        displayElement(submitError, false);
        let rememberMe = $('#remember-me').is(':checked');
        let error = false;

        if (!username.val().match(emailRegex)) {
            usernameErr.text('Моля, въведете валидно потребителско име');
            displayElement(usernameErr, true);
            error = true;
        }

        if (password.val().length < PASSWORD_MIN_LENGTH) {
            passwordErr.text('Моля, въведете валидна парола от минимум ' + PASSWORD_MIN_LENGTH + ' символа');
            displayElement(passwordErr, true);
            error = true;
        }
        
        if (!error) {
            $.ajax({
                url: apiPrefix + '/user/login',
                error: function() {
                    submitError.html(`${exclamationMark}<span>Проблем с връзката към сървъра.<br>Моля, опитайте по-късно!</span>`);
                    displayElement(submitError, true);
                },
                type: 'POST',
                data: {
                    email: username.val(),
                    password: password.val()
                }
            })
            .done(function(response) {
                displayElement(submitError, false);
                if (response.user && response.token) {
                    localStorage.setItem(LOCALSTORAGE_USER_TOKEN_KEY, response.token);
                    localStorage.setItem(LOCALSTORAGE_USER_KEY,JSON.stringify({...response.user}));
                    let exdays = rememberMe ? DAYS_TO_REMEMBER_A_LOGGED_USER : 0; // if 0 - session cookie
                    setCookie(COOKIE_TOKEN_KEY, response.token, exdays);
                    cleanForm();
                    window.location.href = "/admin";
                } else {
                    const errorMessage = response.msg || response.message || 'Грешен или невалиден потребител/парола!';
                    submitError.html(`${exclamationMark}<span>${errorMessage}</span>`);
                    displayElement(submitError, true);
                }
            })
            .fail(function(res) {
                displayElement(submitError, false);
                submitError.html(`${exclamationMark}<span>${res.responseJSON.message}</span>`);
                displayElement(submitError, true);
            });
        }
    });

    function cleanForm() {

        $('#jq-login-form').trigger('reset');

        // username.css(boxShadowInitial);
        // username.siblings('.jq-icon').removeClass('populated');

        // password.css(boxShadowInitial);
        // password.siblings('.jq-icon').removeClass('populated');
    }
});