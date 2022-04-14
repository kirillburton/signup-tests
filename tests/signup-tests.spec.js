import { SignUpPage } from './page-objects/signup-page/SignUpPage.js';
import { EmailConfirmationPage } from './page-objects/email-confirmation-page/EmailConfirmationPage.js';
import { UserBuilder } from './helpers/UserBuilder.js';

const checkEmailText = 'Check your email';

describe('Sign up form', () => {  
    context('in landscape', () => {
        beforeEach(() => {
            cy.viewport('macbook-13');
        })
        signUpSuite();
    });
    context('on mobile-like viewport', () => {
        beforeEach(() => {
            cy.viewport('iphone-xr');
            cy.setCookie('OptanonAlertBoxClosed', new Date().toISOString());
        })
        signUpSuite();
    }) 
});

function signUpSuite() {
    
    it('asks to accept terms and conditions', () => {
        const page = new SignUpPage(cy);
       
        const user = new UserBuilder().build();
        page.inputCredentials(user);
        page.signUp();

        page.termsError.should('contain.text', 'Please agree with the Terms to sign up.');
    });

    it('does not proceed with insecure password', () => {
        const page = new SignUpPage(cy);

        const user = new UserBuilder().setPassword('a').build();
        page.inputCredentials(user);
        page.acceptTerms();
        page.signUp();

        page.passwordHint.should('contain.text', 'Please use 8+ characters for secure password.');
    });

    // Ideally, testing form validations should be in jest tests for each field,
    // but we should test that the whole page state is invalid when a required field is invalid
    it('does not proceed with invalid email', () => {
        const page = new SignUpPage(cy);

        const user = new UserBuilder().setEmail('test.com').build();
        page.inputCredentials(user);
        page.acceptTerms();
        page.signUp();

        page.emailError.should('contain.text', 'Enter a valid email address.')
    });

    it('does not register already registered email', () => {
        const page = new SignUpPage(cy);

        // Preferably use some pre-prepared account, this one is mine
        const user = new UserBuilder().setEmail('kirillburton@yandex-team.ru').build();
        page.inputCredentials(user);
        page.acceptTerms();
        page.signUp();

        page.emailError.should('contain.text', 'Sorry, this email is already registered')
    });

    it('does not proceed with empty name', () => {
        const page = new SignUpPage(cy);

        const user = new UserBuilder().setName("").build();
        page.inputCredentials(user);
        page.acceptTerms();
        page.signUp();

        page.nameError.should('contain.text', 'Please enter your name.');
    });

    it('shows which fields should be filled on submitting when empty', () => {
        const page = new SignUpPage(cy);

        page.signUp();

        page.nameError.should('contain.text', 'Please enter your name.');
        page.emailError.should('contain.text', 'Enter your email address.');
        page.passwordValidationError.should('contain.text', 'Enter your password.');
    });

    it('proceeds to email confirmation with valid inputs', () => {
        let page = new SignUpPage(cy);

        const user = new UserBuilder().build();
        page.inputCredentials(user);
        page.acceptTerms();
        page.signUp();

        assertConfirmationScreen(page, user);
    });

    it('proceeds to email confirmation with valid inputs and a newsletter subscription', () => {
        let page = new SignUpPage(cy);

        const user = new UserBuilder().build();
        page.inputCredentials(user);
        page.acceptTerms();
        page.subscribeToNewsletter();
        page.signUp();

        assertConfirmationScreen(page, user);
        // Would be good to check in newsletter's DB if we subscribe user without confirmation  
    });


    it('does not accept password identical to name', () => {
        const page = new SignUpPage(cy);

        const user = new UserBuilder().build();
        user.password = user.name;
        page.inputCredentials(user);
        page.acceptTerms();
        page.signUp();

        page.passwordSubmitError.should('contain.text', 'Sorry, name and password cannot be the same.');
    });

    it('does not accept password identical to email address', () => {
        const page = new SignUpPage(cy);
        
        const user = new UserBuilder().build();
        user.password = user.email;
        page.inputCredentials(user);
        page.acceptTerms();
        page.signUp();

        // Inconsistency with previous test – there's no dot now for some reason
        page.passwordSubmitError.should('contain.text', 'Sorry, login and password cannot be the same');
    });

    it('can be filled and submitted with keyboard controls', () => {
        let page = new SignUpPage(cy);

        const user = new UserBuilder().build();
        page.nameInput
            .type(user.name)
            .tab()
            .type(user.email)
            .tab()
            .type(user.password)
            .tab()
            .check({ force: true }) // Checking not with {space} is technically cheating, but we will use it for now
            .type('{enter}');
    
        assertConfirmationScreen(page, user);
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
            ["123456789012345678901234567890123456789012345678901234567890123+x@mail.com", valid],
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
    
    function assertConfirmationScreen(page, user) {
        page.ctx.on("url:changed", () => { });
        const newPage = new EmailConfirmationPage(page.ctx, true);
        newPage.title.should('contain.text', checkEmailText);
        newPage.subtitle.should('contain.text', user.email);
    }
}
