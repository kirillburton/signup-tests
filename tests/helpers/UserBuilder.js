import { v4 as uuidv4 } from 'uuid';

class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

// This builder may be excess in the context of signup tests,
// but this is a good practice to create complex test data instead of 
// creating typical helpers which end up in tests like 
// const user = createUser(Kirill, null, null, 25, null, true); 

export class UserBuilder {
    constructor() {
        this.user = new User();
    }
  
    setName(name) {
        this.user.name = name;
        return this;
    }

    setEmail(email) {
        this.user.email = email;
        return this;
    }
    
    setPassword(password) {
        this.user.password = password;
        return this;
    }

    build() {
        if (this.user.name === undefined) this.user.name = 'ktest' + uuidv4();
        if (this.user.email === undefined) this.user.email = this.user.name + '@gmail.com';
        if (this.user.password === undefined) this.user.password = 'password';
        return this.user;
    }
}