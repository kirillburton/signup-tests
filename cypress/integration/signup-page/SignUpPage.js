import { SignUpPageSelectors } from "./SignUpPageSelectors.js";

const selectors = new SignUpPageSelectors;

export class SignUpPage {
    constructor(ctx, isAlreadyOpen) {
        this.ctx = ctx;
        if (!isAlreadyOpen) this.ctx.visit(this.url); 
    }
    get nameInput() { return this.ctx.get(selectors.nameInput); }
    get nameError() { return this.ctx.get(selectors.nameError); }
    get emailInput() { return this.ctx.get(selectors.emailInput); }
    get emailError() { return this.ctx.get(selectors.emailError); } 
    get passwordInput() { return this.ctx.get(selectors.passwordInput); }
    get passwordHint() { return this.ctx.get(selectors.passwordHint); }
    get passwordValidationError() { return this.ctx.get(selectors.passwordValidationError); }
    get passwordSubmitError() { return this.ctx.get(selectors.passwordSubmitError); }
    get registerButton() { return this.ctx.get(selectors.registerButton); }
    get termsCheckbox() { return this.ctx.get(selectors.termsCheckbox); }
    get termsError() { return this.ctx.get(selectors.termsError) };
    get newsletterCheckbox() { return this.ctx.get(selectors.newsletterCheckbox); }
    get acceptAllCookiesButton() { return this.ctx.get(selectors.acceptAllCookiesButton); }
    
    url = 'https://miro.com/signup';

    signUp() {
        this.registerButton.click();
    }
    acceptTerms() {
        this.termsCheckbox.check({force: true});
    }
    subscribeToNewsletter() {
        this.newsletterCheckbox.check({force: true});
    }
    inputCredentials(user) {
        if(user.name) this.nameInput.type(user.name);
        if(user.email) this.emailInput.type(user.email);
        if(user.password) this.passwordInput.type(user.password);
    }
    acceptCookies() {
        this.acceptAllCookiesButton.click();
    }
}