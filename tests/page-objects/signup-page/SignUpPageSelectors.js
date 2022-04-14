export const SignUpPageSelectors  = {
    registerButton: buildDatatidSelector('mr-form-signup-btn-start-1'),
    nameInput: buildDatatidSelector('mr-form-signup-name-1'),
    nameError: '#nameError',
    emailInput: buildDatatidSelector('mr-form-signup-email-1'),
    emailError: '#emailError',
    passwordInput: buildDatatidSelector('mr-form-signup-password-1'),
    passwordHint: '#password-hint',
    passwordValidationError: buildDatatidSelector('please-enter-your-password-1'),
    passwordSubmitError: '#passwordError',
    termsCheckbox: '#signup-terms',
    termsError: '#termsError',
    newsletterCheckbox: '#signup-subscribe',
    acceptAllCookiesButton: '#onetrust-accept-btn-handler'
}

function buildDatatidSelector(id) {
    return `[data-testid=${id}]`;
}