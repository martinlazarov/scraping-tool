// for functions and vars used in this script, please refer to ./common.js

$(document).ready(function () {
  let latitude;
  let longitude;
  const input = document.getElementById("companyAddress");
  const options = {
    componentRestrictions: { country: "bg" },
    fields: ['geometry']
  };
  const autocomplete = new google.maps.places.Autocomplete(input, options);
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      window.alert(`Не е намерена информация за ${place.name}`);
      return;
    }
    const { geometry } = place;
    latitude = geometry.location.lat();
    longitude = geometry.location.lng()
  });

  const step1 = $('#jq-step1');
  const step2 = $('#jq-step2');
  const step3 = $('#jq-step3');
  const buttonToStep1 = $('#to-step-1');
  const buttonToStep2 = $('#to-step-2');
  const buttonToStep3 = $('#to-step-3');
  const buttonStep3ToStep2 = $('#step3-to-step2');

  const companyName = $('#companyName');
  const companyNameErr = companyName.parent().siblings('.validation-text');
  const companyEmail = $('#companyEmail');
  const companyEmailErr = companyEmail.parent().siblings('.validation-text');
  const companyPass = $('#companyPass');
  const companyPassErr = companyPass.parent().siblings('.validation-text');
  const companyPassConfirm = $('#companyPassConfirm');
  const companyPassConfirmErr = companyPassConfirm.parent().siblings('.validation-text');

  let error = false;

  companyName.on('input', function () {
    displayElement(companyNameErr, false);
    if (companyName.val().length > 0) {
      companyName.siblings('.jq-icon').addClass('populated');
      companyName.val().length >= COMPANY_NAME_MIN_LENGTH ? companyName.css(boxShadowValid) : companyName.css(boxShadowInvalid);
      return;
    }
    cleanField(companyName);
  });

  companyEmail.on('input', function () {
    displayElement(companyEmailErr, false);
    if (companyEmail.val().length > 0) {
      companyEmail.siblings('.jq-icon').addClass('populated');
      companyEmail.val().match(emailRegex) ? companyEmail.css(boxShadowValid) : companyEmail.css(boxShadowInvalid);
      return;
    }
    cleanField(companyEmail);
  });

  companyPass.on('input', function () {
    displayElement(companyPassErr, false);
    if (companyPass.val().length > 0) {
      companyPass.siblings('.jq-icon').addClass('populated');
      companyPass.val().length >= PASSWORD_MIN_LENGTH ? companyPass.css(boxShadowValid) : companyPass.css(boxShadowInvalid);
      return;
    }
    cleanField(companyPass);
  });

  companyPassConfirm.on('input', function () {
    displayElement(companyPassConfirmErr, false);
    if (companyPassConfirm.val().length > 0) {
      companyPassConfirm.siblings('.jq-icon').addClass('populated');
      companyPassConfirm.val() === companyPass.val() ? companyPassConfirm.css(boxShadowValid) : companyPassConfirm.css(boxShadowInvalid);
      return;
    }
    cleanField(companyPassConfirm);
  });


  // Step 1 validation
  buttonToStep2.click(function () {
    displayElement(companyNameErr, false);
    displayElement(companyEmailErr, false);
    displayElement(companyPassErr, false);
    displayElement(companyPassConfirmErr, false);
    error = false;

    if (companyName.val().length < COMPANY_NAME_MIN_LENGTH) {
      companyNameErr.text('Моля, въведете валидно име на фирма');
      displayElement(companyNameErr, true);
      error = true;
    }

    if (!companyEmail.val().match(emailRegex)) {
      companyEmailErr.text('Моля, въведете валидна електронна поща');
      displayElement(companyEmailErr, true);
      error = true;
    }

    if (companyPass.val().length < PASSWORD_MIN_LENGTH) {
      companyPassErr.text('Моля, въведете парола от минимум ' + PASSWORD_MIN_LENGTH + ' символа');
      displayElement(companyPassErr, true);
      error = true;
    }

    if (companyPassConfirm.val() !== companyPass.val()) {
      companyPassConfirmErr.text('Паролите не съвпадат');
      displayElement(companyPassConfirmErr, true);
      error = true;
    }

    if (!error) {
      displayElement(step1, false);
      displayElement(step2, true);
      $("html, body").animate({ scrollTop: 0 }, "slow");
    }

  });

  // Step 2 validation
  const firstName = $('#firstName');
  const firstNameErr = firstName.parent().siblings('.validation-text');
  const lastName = $('#lastName');
  const lastNameErr = lastName.parent().siblings('.validation-text');
  const phoneNum = $('#phoneNum');
  const phoneNumErr = phoneNum.parent().siblings('.validation-text');
  const companyAddress = $('#companyAddress');
  const companyAddressErr = companyAddress.parent().siblings('.validation-text');


  function personName(name) {
    name.siblings('.jq-icon').addClass('populated');
    const style = (name.val().length >= PERSON_NAME_MIN_LENGTH) ? boxShadowValid : boxShadowInvalid;
    name.css(style);
  }

  firstName.on('input', function () {
    displayElement(firstNameErr, false);
    if (firstName.val().length > 0) {
      personName(firstName);
      return;
    }
    cleanField(firstName);
  });

  lastName.on('input', function () {
    displayElement(lastNameErr, false);
    if (lastName.val().length > 0) {
      personName(lastName);
      return;
    }
    cleanField(lastName);
  });

  phoneNum.on('input', function () {
    displayElement(phoneNumErr, false);
    if (phoneNum.val().length > 0) {
      phoneNum.siblings('.jq-icon').addClass('populated');
      phoneNum.val().match(phoneRegex) ? phoneNum.css(boxShadowValid) : phoneNum.css(boxShadowInvalid);
      return;
    }
    cleanField(phoneNum);
  });

  companyAddress.on('input', function () {
    displayElement(companyAddressErr, false);
    if (companyAddress.val().length > 0) {
      companyAddress.siblings('.jq-icon').addClass('populated');
      companyAddress.val().length > 0 ? companyAddress.css(boxShadowValid) : companyAddress.css(boxShadowInvalid);
      return;
    }
    cleanField(companyAddress);
  });

  // no need for validation if going back to step1
  buttonToStep1.click(function () {
    displayElement(step2, false);
    displayElement(firstNameErr, false);
    displayElement(lastNameErr, false);
    displayElement(phoneNumErr, false);
    displayElement(companyAddressErr, false);
    displayElement(step1, true);
    $("html, body").animate({ scrollTop: 0 }, "slow");
  });

  buttonToStep3.click(function () {
    displayElement(firstNameErr, false);
    displayElement(lastNameErr, false);
    displayElement(phoneNumErr, false);
    displayElement(companyAddressErr, false);
    error = false;

    if (firstName.val().length < PERSON_NAME_MIN_LENGTH) {
      firstNameErr.text('Моля, въведете валидно име');
      displayElement(firstNameErr, true);
      error = true;
    }

    if (lastName.val().length < PERSON_NAME_MIN_LENGTH) {
      lastNameErr.text('Моля, въведете валидна фамилия');
      displayElement(lastNameErr, true);
      error = true;
    }

    if (!phoneNum.val().match(phoneRegex)) {
      phoneNumErr.text('Моля, въведете валиден телефонен номер');
      displayElement(phoneNumErr, true);
      error = true;
    }

    if (companyAddress.val().length < COMPANY_ADDRESS_MIN_LENGTH) {
      companyAddressErr.text('Моля, въведете валиден фирмен адрес');
      displayElement(companyAddressErr, true);
      error = true;
    }
    
    if (companyAddress.val().length && !latitude && !longitude) {
      companyAddressErr.text('Така въведения адрес е невалиден! Моля, въведете адреса ръчно, избирайки от предложените локации');
      displayElement(companyAddressErr, true);
      error = true;
    }

    if (!error) {
      displayElement(step2, false);
      displayElement(step3, true);
      $("html, body").animate({ scrollTop: 0 }, "slow");
    }
  });


  // final step validation and form submission

  const businessType = $('#jq-step3 input:radio[name="businessTypeOptions"]');
  const businessTypeErr = $('#jq-step3 .validation-text');
  const termsOfService = $('#agree-with-terms');
  let businessTypeId;


  businessType.change(function () {
    displayElement(businessTypeErr, false);
    businessType.siblings('label').removeClass('active');
    if ($(this).is(':checked')) {
      businessTypeId = $(this).val();
      $(this).next().addClass('active'); // mark the selected answer
    }
  });

  buttonStep3ToStep2.click(function () {
    displayElement(step3, false);
    displayElement(businessTypeErr, false);
    displayElement(submitError, false);
    displayElement(step2, true);
    $("html, body").animate({ scrollTop: 0 }, "slow");
  });

  $('#jq-registration-form').submit(function (evt) {
    evt.preventDefault();
    error = false;

    displayElement(businessTypeErr, false);
    displayElement(submitError, false);

    if (!businessType.is(':checked')) {
      businessTypeErr.text('Моля, изберете типа на вашия бизнес');
      displayElement(businessTypeErr, true);
      error = true;
    }

    if (!error && !termsOfService.is(':checked')) {
      setInfoModalContents(`<span style="color: red;">${exclamationMark}</span> За успешно приключване на регистрацията е необходимо съгласие с Общите условия за използване на платформата.`);
      $('#jq-modal').modal('show');
      error = true;
    }

    if (!error) {
      $.ajax({
        url: apiPrefix + '/company/register',
        error: function (error) {
          if (error.status === 400) {
            submitError.html(`${exclamationMark}<span>${error.responseJSON.msg}</span>`);
            displayElement(submitError, true);
          } else {
            submitError.html(`${exclamationMark}<span>Проблем с връзката към сървъра.<br>Моля, опитайте по-късно!</span>`);
            displayElement(submitError, true);
          }
        },
        type: 'POST',
        data: {
          company: {
            type: businessTypeId,
            email: companyEmail.val(),
          },
          manager: {
            email: companyEmail.val(),
            password: companyPass.val(),
            firstName: firstName.val(),
            lastName: lastName.val(),
          },
          restaurant: {
            name: companyName.val(),
            phoneNumber: phoneNum.val(),
            address: companyAddress.val(),
            latitude,
            longitude
          },
          product: {

          }
        }
      })
      .done(function (response) {
        displayElement(submitError, false);
        if (response.companyId && response.managerId) {
          cleanForm();
          setInfoModalContents('Благодарим Ви за регистрацията. На Е-мейл адресът, който попълнихте ще получите допълнителна информация как да активирате акаунта си.');
          $('#jq-modal').modal('show');
        } else {
          const errorMessage = response.msg || response.message || 'Възникна грешка при регистрацията!';
          submitError.html(`${exclamationMark}<span>${errorMessage}</span>`);
          displayElement(submitError, true);
        }
      });
    }
  });

  function cleanForm() {

    $('#jq-registration-form').trigger('reset');

    companyName.css(boxShadowInitial);
    companyName.siblings('.jq-icon').removeClass('populated');

    companyEmail.css(boxShadowInitial);
    companyEmail.siblings('.jq-icon').removeClass('populated');

    companyPass.css(boxShadowInitial);
    companyPass.siblings('.jq-icon').removeClass('populated');

    companyPassConfirm.css(boxShadowInitial);
    companyPassConfirm.siblings('.jq-icon').removeClass('populated');

    firstName.css(boxShadowInitial);
    firstName.siblings('.jq-icon').removeClass('populated');

    lastName.css(boxShadowInitial);
    lastName.siblings('.jq-icon').removeClass('populated');

    phoneNum.css(boxShadowInitial);
    phoneNum.siblings('.jq-icon').removeClass('populated');

    companyAddress.css(boxShadowInitial);
    companyAddress.siblings('.jq-icon').removeClass('populated');

    businessType.siblings('label').removeClass('active');

    //start over
    displayElement(step3, false);
    displayElement(step1, true);
    $("html, body").animate({ scrollTop: 0 }, "slow");
  }
});