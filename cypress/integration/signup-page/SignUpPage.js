export class SignUpPage {
    constructor(ctx) {
        this.ctx = ctx;
        this.ctx.visit('https://miro.com/signup');
    }
    get nameInput() { return this.ctx.get(nameInput); }
    get emailInput() { return this.ctx.get(emailInput); }
    get passwordInput()  { return this.ctx.get(passwordInput); }
    get registerButton() { return this.ctx.get(registerButton); }
    get termsCheckbox() { return this.ctx.get(termsCheckbox).find('#signup-terms'); }
    get newsletterCheckbox() { return this.ctx.get(newsletterCheckbox); }
    get termsError() { return this.ctx.get(termsError) };
    get passwordHint() { return this.ctx.get(passwordHint); }
    get emailError() { return this.ctx.get(emailError); }
    
    signUp() {
        this.registerButton.click();
    }
    acceptTerms() {
        this.termsCheckbox.check({force: true});
    }
    subscribeToNewsletter() {
        this.newsletterCheckbox.check();
    }
    inputCredentials(user) {
        this.nameInput.type(user.name);
        this.emailInput.type(user.email);
        this.passwordInput.type(user.password);
    }
}

const registerButton = buildDatatidSelector('mr-form-signup-btn-start-1');
const nameInput = buildDatatidSelector('mr-form-signup-name-1');
const emailInput = buildDatatidSelector('mr-form-signup-email-1');
const passwordInput = buildDatatidSelector('mr-form-signup-password-1');
const termsCheckbox = buildDatatidSelector('mr-form-signup-terms-1');
const newsletterCheckbox = buildDatatidSelector('mr-form-signup-subscribe-1');
const termsError = '#termsError';
const passwordHint = '#password-hint';
const emailError = '#emailError';

function buildDatatidSelector(id) {
    return `[data-testid=${id}]`;
}

