import { v4 as uuidv4 } from 'uuid';

export class UserBuilder {
    constructor(name, email, password) {
        this.name = name || 'ktest' + uuidv4();
        this.email = email || this.name + '@gmail.com';
        this.password = password || "password";
    }
}