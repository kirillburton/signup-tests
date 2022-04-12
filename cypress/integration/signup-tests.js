import { SignUpPage } from './signup-page/SignUpPage.js';
import { UserBuilder } from './helpers/UserBuilder.js';

describe('Sign up form', () => {
    beforeEach(() => {
    })

    /*it('contains name, email and password fields', () => {
        const page = new SignUpPage(cy);
        page.nameInput.should('be.visible');
        page.emailInput.should('be.visible');
        page.passwordInput.should('be.visible');
    });

    it('asks to check terms and conditions', () => {
        const page = new SignUpPage(cy);
        const name = 'ktest' + uuidv4();
        const errorText = 'Please agree with the Terms to sign up.';

        page.nameInput.type(name);
        page.emailInput.type(name + '@gmail.com');
        page.passwordInput.type("password");
        page.signUp();

        page.termsError.should('contain.text', errorText);
        //page.termsCheckbox.should('be.focused');
    });

    it('does not proceed with invalid password', () => {
        const page = new SignUpPage(cy);
        const name = 'ktest' + uuidv4();
        const passwordError = 'Please use 8+ characters for secure password.';

        page.nameInput.type(name);
        page.emailInput.type(name + '@gmail.com');
        page.passwordInput.type('a');
        page.acceptTerms();
        page.signUp();

        page.passwordHint.should('contain.text', passwordError);
    });*/

    // test like this should not duplicate isolated component tests for various fields,
    // it's here to confirm that the state of the whole page is not valid when the field is invalid
    it('does not proceed with invalid email', () => {
        const page = new SignUpPage(cy);
        const user = new UserBuilder();
        const passwordError = 'Enter a valid email address.';

        user.email = "test.com";
        page.inputCredentials(user);
        page.acceptTerms();
        page.signUp();

        page.emailError.should('contain.text', passwordError);
    });

    
    it('proceeds to email confirmation with valid inputs', () => {
        const page = new SignUpPage(cy);
        const user = new UserBuilder();
        const confirmationUrl = 'https://miro.com/email-confirm/';

        page.inputCredentials(user);
        page.acceptTerms();
        page.signUp();

        cy.url().should('be.equal', confirmationUrl);
    });
});
