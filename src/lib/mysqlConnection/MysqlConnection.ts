import connectionPool from './ConnectionPool';
import Q from 'q';

/* eslint-disable */
const queryFormat = function (mysqlConnection) {
  mysqlConnection.config.queryFormat = function (query, values) {
    if (!values) return query;
    return query.replace(/\:(\w+)/g, function (txt, key) {
      if (values.hasOwnProperty(key)) {
        return this.escape(values[key]);
      }
      return txt;
    }.bind(this));
  };
  return mysqlConnection;
};

const makeQuery = function (query, args, filter, debug) {
  const deferred = Q.defer(),
    me = this; // eslint-disable-line

  if (!filter || typeof filter !== 'function') {
    filter = function (_) { return _; };
  }

  connectionPool.getConnection(function (err, connection) {
    if (err) {
      return deferred.reject(err);
    }
    connection = me.queryFormat(connection);

    const q = connection.query(query, args, function (err, results) {
      if (debug === true) {
        console.log('makeQuery', q.sql);
      }
      connection.release();
      if (err) {
        return deferred.reject(err);
      }
      return deferred.resolve(filter(results));
    });
  });

  return deferred.promise;
};
const escape = function (string) {
  return connectionPool.escape(string);
};

module.exports = {
  queryFormat,
  makeQuery,
  escape
}