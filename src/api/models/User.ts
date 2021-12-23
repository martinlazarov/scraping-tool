export class User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: number;
  isActive: number;
  registrationToken: string;
  registrationDate: Date;

  constructor(data: User) {
    if (data.email) {
      this.email = data.email.trim().toLowerCase();
    }

    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.phoneNumber = data.phoneNumber;
    this.role = data.role;
    this.isActive = data.isActive;
    this.registrationToken = data.registrationToken;
    this.registrationDate = data.registrationDate;
  }
}