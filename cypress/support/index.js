import 'cypress-plugin-tab'

// cypress typically fails on unhandled exceptions
// on miro.com there is an uncaught exception that originates from google,
// we want to ignore that one, but not the others
Cypress.on('uncaught:exception', (e) => {
    
    if (e.message.includes('common is not defined')) {
        return false;
    }
});
