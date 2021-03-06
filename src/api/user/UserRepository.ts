import bcrypt from 'bcryptjs';
import { LoginData } from "../models/LoginData";
import { ScrapeData } from "../models/ScrapeData";
import { User } from "../models/User";
import { Roles } from '../../shared/enums/roles.enum';

export class UserRepository {

  mysql: any
  selectUser = [
    'SELECT id, email, first_name AS firstName, last_name AS lastName, phone_number AS phoneNumber, role,',
    'is_active AS isActive, registration_token AS registrationToken, created_at AS registrationDate'
  ].join(" ")

  constructor(mysql) {
    this.mysql = mysql;
  }

  public findUser(id: number, getRegardlessOfStatus = false): any {
    let query = `${this.selectUser} FROM user WHERE id = :id`;

    query += getRegardlessOfStatus ? ' LIMIT 1;' : ' AND is_active = 1 LIMIT 1;';

    return this.mysql.makeQuery(query, { id }, function (users) {
      return (users && users.length > 0)
        ? new User(users[0])
        : null;
    });
  }

  public findUserIdByEmail(email: string): any {
    const query = `${this.selectUser} FROM user WHERE email = :email LIMIT 1;`;

    return this.mysql.makeQuery(query, { email }, function (users) {
      return (users && users.length > 0)
        ? new User(users[0]).id
        : null;
    });
  }

  public registerUser(data: User, password: string): any {
    const query = [
      'INSERT INTO `user` (`email`, `first_name`, `last_name`, `password`, `registration_token`, `phone_number`, `role`)',
      `VALUES (:email, :firstName, :lastName, '${bcrypt.hashSync(password)}', :registrationToken, :phoneNumber, ${Roles.User});` // eslint-disable-line
    ].join(" ");

    return this.mysql.makeQuery(query, data, function (result) {
      return result.insertId; // eslint-disable-line
    });
  }

  public getData(params): any {

    let query = 'SELECT id, photo, title, price, currency, link FROM items WHERE 1'

    if (params.title) {
      query += ` AND title LIKE '%${params.title}%'`
    }
    if (params.minPrice) {
      query += ` AND price >= ${params.minPrice}`
    }
    if (params.maxPrice) {
      query += ` AND price <= ${params.maxPrice}`
    }

    return this.mysql.makeQuery(query, { params }, function (result) {
      console.log(result)
      return result; // eslint-disable-line
    }, true);
  }

  public deleteData(): any {
    const query = 'TRUNCATE TABLE items;'
    
    return this.mysql.makeQuery(query, {}, function (result) {
      return result; // eslint-disable-line
    });
  }

  public insertData(data: ScrapeData): any {
    const query = [
      'INSERT INTO `items` (`photo`, `title`, `price`, `currency`, `link`)',
      `VALUES (:photo, :title, :price, :currency, :link);` // eslint-disable-line
    ].join(" ");

    return this.mysql.makeQuery(query, data, function (result) {
      return result.insertId; // eslint-disable-line
    });
  }

  public loginUser(login: LoginData): any {
    const query = `${this.selectUser}, password FROM user WHERE email = :email LIMIT 1;`;

    return this.mysql.makeQuery(query, { email: login.email }, function (users) {
      if (users.length === 0) {
        return false;
      }
      const user = users[0];
      if (!user.password) {
        return false;
      }
      let loggedUser = null;
      if (bcrypt.compareSync(login.password, user.password)) {
        loggedUser = new User(user);
      }
      return loggedUser; // eslint-disable-line

    });
  }
}
