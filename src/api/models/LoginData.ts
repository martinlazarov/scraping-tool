export class LoginData {
    email: string;
    password: string

    constructor(data: LoginData) {
        if (data.email) {
            this.email = data.email.trim().toLowerCase();
        }
        this.password = data.password;
    }
}