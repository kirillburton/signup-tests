import { EmailConfirmationPageSelectors } from "./EmailConfirmationPageSelectors.js";

const selectors = new EmailConfirmationPageSelectors;

export class EmailConfirmationPage {
    constructor(ctx, isAlreadyOpen) {
        this.ctx = ctx;
        if (!isAlreadyOpen) this.ctx.visit(this.url);
    }
    get title() { return this.ctx.get(selectors.title); }
    get subtitle() { return this.ctx.get(selectors.subtitle); }
    url = 'https://miro.com/email-confirm/';
}