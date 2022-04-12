cy.on('uncaught:exception', (e) => {
    // this is an uncaught exception in production
    if (e.message.includes('common is not defined')) {
        return false;
    }
})