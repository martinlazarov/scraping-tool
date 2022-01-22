import { UserRepository } from "./UserRepository";

export class UserController {

  repository: UserRepository;

  constructor(Repository: UserRepository) {
    this.repository = Repository;
  }

}