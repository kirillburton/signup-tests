import { SignUpPage } from './signup-page/SignUpPage.js';
import { UserBuilder } from './helpers/UserBuilder.js';
import { EmailConfirmationPage } from './email-confirmation-page/EmailConfirmationPage.js';

const checkEmailText = 'Check your email';

describe('Sign up form', () => {  
    context('on desktop', () => {
        beforeEach(() => {
            cy.viewport('macbook-13');
        })
        signUpSuite();
    });
    context('on mobile', () => {
        beforeEach(() => {
            cy.viewport('iphone-xr');
        })
        signUpSuite();
    })
});

function signUpSuite(page) {
    
    it('asks to accept terms and conditions', () => {
        const page = new SignUpPage(cy);
        const user = new UserBuilder();
        const errorText = 'Please agree with the Terms to sign up.';

        page.inputCredentials(user);
        page.signUp();

        page.termsError.should('contain.text', errorText);
    });

    it('does not proceed with insecure password', () => {
        const page = new SignUpPage(cy);
        const user = new UserBuilder();
        const passwordError = 'Please use 8+ characters for secure password.';

        user.password = 'a';
        page.inputCredentials(user);
        page.acceptTerms();
        page.signUp();

        page.passwordHint.should('contain.text', passwordError);
    });

    // Ideally, testing form validations should be in jest tests for each field,
    // but we should test that the whole page state is invalid when a required field is invalid
    it('does not proceed with invalid email', () => {
        const page = new SignUpPage(cy);
        const user = new UserBuilder();
        const errorText = 'Enter a valid email address.';

        user.email = "test.com";
        page.inputCredentials(user);
        page.acceptTerms();
        page.signUp();

        page.emailError.should('contain.text', errorText)
    });

    it('does not register already registered email', () => {
        const page = new SignUpPage(cy);
        const user = new UserBuilder();
        const errorText = 'Sorry, this email is already registered';

        user.email = "kirillburton@yandex-team.ru"; // Preferably some pre-prepared account, this one is mine
        page.inputCredentials(user);
        page.acceptTerms();
        page.signUp();

        page.emailError.should('contain.text', errorText)
    });

    it('does not proceed with empty name', () => {
        const page = new SignUpPage(cy);
        const user = new UserBuilder();
        const emptyNameError = 'Please enter your name.';

        user.name = "";
        page.inputCredentials(user);
        page.acceptTerms();
        page.signUp();

        page.nameError.should('contain.text', emptyNameError);
    });

    it('shows which fields should be filled on submitting when empty', () => {
        const page = new SignUpPage(cy);
        const emptyNameError = 'Please enter your name.';
        const emptyEmailError = 'Enter your email address.';
        const emptyPasswordError = 'Enter your password.';

        page.signUp();

        page.nameError.should('contain.text', emptyNameError);
        page.emailError.should('contain.text', emptyEmailError);
        page.passwordValidationError.should('contain.text', emptyPasswordError);
    });

    it('proceeds to email confirmation with valid inputs', () => {
        let page = new SignUpPage(cy);
        const user = new UserBuilder();

        page.inputCredentials(user);
        page.acceptTerms();
        page.signUp();

        page = new EmailConfirmationPage(cy, true);
        page.title.should('contain.text', checkEmailText);
        page.subtitle.should('contain.text', user.email);
    });

    it('proceeds to email confirmation with valid inputs and a newsletter subscription', () => {
        let page = new SignUpPage(cy);
        const user = new UserBuilder();

        page.inputCredentials(user);
        page.acceptTerms();
        page.subscribeToNewsletter();
        page.signUp();

        page = new EmailConfirmationPage(cy, true);
        page.title.should('contain.text', checkEmailText);
        page.subtitle.should('contain.text', user.email);
        // Wpuld be good to check in newsletter's DB if we subscribe user without confirmation  
    });


    it('does not accept password identical to name', () => {
        const page = new SignUpPage(cy);
        const user = new UserBuilder();
        const errorText = "Sorry, name and password cannot be the same.";

        user.password = user.name;
        page.inputCredentials(user);
        page.acceptTerms();
        page.signUp();

        page.passwordSubmitError.should('contain.text', errorText);
    });

    it('does not accept password identical to email address', () => {
        const page = new SignUpPage(cy);
        const user = new UserBuilder();
        const errorText = "Sorry, login and password cannot be the same"; // Inconsistency with previous test – there's no dot now for some reason

        user.password = user.email;
        page.inputCredentials(user);
        page.acceptTerms();
        page.signUp();

        page.passwordSubmitError.should('contain.text', errorText);
    });

    it('can be filled and submitted with keyboard controls', () => {
        let page = new SignUpPage(cy);
        const user = new UserBuilder();
    
        page.acceptCookies();
        page.nameInput
            .type(user.name)
            .tab()
            .type(user.email)
            .tab()
            .type(user.password)
            .tab()
            .check({ force: true }) // Checking not with {space} is technically cheating, but will do for now
            .type('{enter}');
    
        page = new EmailConfirmationPage(cy, true);
        page.title.should('contain.text', checkEmailText);
        page.subtitle.should('contain.text', user.email);
    });

    it('is described correcly accessibility-wise', () => {
        // That's not exactly e2e, but seems important.
        // May be rewritten on another layer, or tested differently
        const a11yDescribed = 'aria-describedby';
        const a11yLabeled = 'aria-labelledby'
        const a11yInvalid = 'aria-invalid';
        const page = new SignUpPage(cy);

        page.nameInput.should('have.attr', a11yInvalid, 'false');
        page.emailInput.should('have.attr', a11yInvalid, 'false');
        page.passwordInput.should('have.attr', a11yInvalid, 'false');
        page.termsCheckbox.should('have.attr', a11yInvalid, 'false');
        page.nameInput.should('have.attr', a11yDescribed, 'signup-error-emptyname'); // Why is it described as error? 
        page.emailInput.should('have.attr', a11yDescribed, 'signup-error-emptyemail'); // And this one
        page.passwordInput.should('have.attr', a11yDescribed, 'signup-form-password');
        page.termsCheckbox.should('have.attr', a11yLabeled, 'signup-error-emptyTerms');
    
        page.signUp();
        page.nameInput.should('have.attr', a11yInvalid, 'true');
        page.emailInput.should('have.attr', a11yInvalid, 'true');
        page.passwordInput.should('have.attr', a11yInvalid, 'true');
        page.termsCheckbox.should('have.attr', a11yInvalid, 'true');

    });

    // Next test cases are just to show I still know my test design.  
    /* I just would not include them on an e2e layer:
    
        name = [
            [" ", invalid], 
            ["!#$%^*()_+-=", invalid],
            ["Игнат Тубылов", valid], 
            ["123", invalid],
            ["床前明月光 疑是地上霜", valid]
            ["kerikkerikkerikkerikkerikkerikkerikkerikkerikkerikkerik1", invalid],
            ["kerikkerikkerikkerikkerikkerikkerikkerikkerikkerikkerik", valid]
        ];
        email = [ 
            ["", invalid]
            ["@.c", invalid],
            ["mail!@#$%^&*=()@gmail.com", invalid],
            ["a@a.com", valid], 
            ["123@gmail.com", valid], 
            ["a@a@gmail.com"],
            ["mail@123", invalid],
            ["1234567890123456789012345678901234567890123456789012345678901234+x@mail.com", invalid],
            ["mail9338274632874623@example.com", invalid],
            and so on...
        ];
        password = [
            ["", invalid],
            ["        ", invalid],
            ["!@#$%^&*()_+-=пАроль", valid],
            ["床前明月光 疑是地上霜", valid],
            [password.maxLength, valid],
            [password.maxLength + 1, invalid]
        ]
    
    */
}
