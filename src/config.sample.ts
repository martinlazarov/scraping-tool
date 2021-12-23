const config = {
  environment: 'dev', // dev, qa, production
  apiDomain: 'http://localhost',
  port: 1914,
  database: {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'azbouki',
    multipleStatements: true,
    acquireTimeout: 30000
  },
  apiPrefix: '/apiv1',
  jwtSecret: 'a3byku-jwtsecret'
};
export = config;