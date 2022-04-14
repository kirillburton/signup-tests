import { EmailConfirmationPageSelectors as selectors } from "./EmailConfirmationPageSelectors.js";

export class EmailConfirmationPage {
    constructor(ctx, isAlreadyOpen) {
        this.ctx = ctx;
        if (!isAlreadyOpen) this.ctx.visit(this.url);
    }
    get title() { return this.ctx.get(selectors.title); }
    get subtitle() { return this.ctx.get(selectors.subtitle); }
    
    url = 'email-confirm';
}