'use strict';

// MySQL Driver
var mysql = require('mysql');
// Promises library
var q = require('q');

// Store the connection of this instance. Even if there are multiple Dbal
// instances they will all share the connection.
var connection;

/**
 * Database Abstraction Layer for MySQL. Nothing more, nothing less.
 * This library uses promises in order to get a more sane API.
 *
 * @class Dbal
 * @constructor
 * @param {Object} conf Configuration object
 */
function Dbal(conf) {
  /**
   * The current table, all queries are executed on the table specified by this
   * property, it can be changed though the `table` method.
   */
  this.currentTable = null;

  /**
   * Lazily connects to the database and exposes a connection. This is used
   * internally and you shouldn't need to access to the mysql connection
   * directly, you can nevertheless do so as follows:
   *
   *     this.conn(function (conn) {
   *       // do something with mysql connection
   *     }, function (err) {
   *       // if there was an error connection, handle it here
   *     });
   *
   * @property conn
   * @type Function
   * @param {Function} success The function which will be called with a
   * connection as argument
   * @param {Function} fail The function which will be called if there's a
   * connection error
   * @return {Promisé} A promise bound to this connection
   */
  this.conn = function () {
    // If there's no connection, create one and store the promise in
    // `connection`
    if(!connection) {
      var deferred = q.defer();
      var pool = mysql.createPool(conf);
      pool.getConnection(function (err, conn) {
        // On error call fail callback with error info and exit
        if(err) {
          console.log('mysql error: ', err);
          deferred.reject(err);
          return;
        }

        deferred.resolve(conn);
      });

      connection = deferred.promise;
    }

    // Finally return the connection promise
    return connection;
  };
}

/**
 * Set the current table for queries if the table name is specified, gets the
 * current table name otherwise.
 *
 * @method table
 * @param {String} [name] The name of the table
 * @return {Dbal} This instance
 */
Dbal.prototype.table = function(name) {
  if(!name) {
    if(!this.currentTable) {
      throw 'The query table has not been specified, make sure you call the table function';
    }

    return this.currentTable;
  }

  this.currentTable = name;
  return this;
};

/**
 * Executes a query, this is a very low level function mostly used by the rest
 * of the API, usage should be reserved for edge cases.
 *
 * @method query
 * @param {String} q The query to be executed
 * @param {Function} cb The callback to be executed with the query result
 * @return {Promise} A promise bound to this query
 */
Dbal.prototype.query = function(query) {
  var deferred = q.defer();
  this.conn().then(function (conn) {
    conn.query(query, function(err, res) {
      if(err) {
        deferred.reject(err);
        return;
      }

      deferred.resolve(res);
    });
  });
  return deferred.promise;
};

/**
 * Deletes a row from a table.
 *
 * @method remove
 * @param {Object} filter The filter to find the entries to be removed
 * @param {String} join Either 'AND' or 'OR'
 * @return {Promise} A promise for this insertion
 */
Dbal.prototype.remove = function(filter, join) {
  var table = this.table();
  var keys = [];
  var self = this;
  filter = filter || {};
  join = join || 'AND';

  // connect to the database
  return this.conn()
  // insert to table
  .then(function (conn) {
    Object.keys(filter).forEach(function (key) {
      keys.push('`' + key + '` = ' + conn.escape(filter[key]));
    });

    // Format as list
    keys = keys.join(' ' + join + ' ');

    // Generate query and execute
    var query = 'DELETE FROM `' + table + '` WHERE ' + keys;
    return self.query(query);
  });
};

/**
 * Insert the given object into the specified table.
 *
 * @method insert
 * @param {String} obj An object which represents the key-value pairs to be
 * inserted
 * @return {Promise} A promise for this insertion
 */
Dbal.prototype.insert = function(obj) {
  var table = this.table();
  var keys = [];
  var values = [];
  var self = this;

  // connect to the database
  return this.conn()
  // insert to table
  .then(function (conn) {
    Object.keys(obj).forEach(function (key) {
      keys.push('`' + key + '`');
      values.push(conn.escape(obj[key]));
    });

    // Format as list
    keys = keys.join(', ');
    values = values.join(', ');

    // Generate query and execute
    var query = 'INSERT INTO `' + table + '` (' + keys + ') VALUES (' + values + ')';
    return self.query(query);
  });
};

Dbal.prototype.update = function(obj, where, type) {
  var self = this;

  if(typeof where === 'number') {
    where = { id: where };
  }

  return this.conn()
  // Once connected, update the table
  .then(function (conn) {
    var set = [];
    var cond = [];
    var cond_glue = type || 'AND';

    Object.keys(obj).forEach(function (key) {
      set.push('`' + key + '`=' + conn.escape(obj[key]));
    });

    Object.keys(where).forEach(function (key) {
      cond.push('`' + key + '`=' + conn.escape(where[key]));
    });

    var table = self.table();
    var query = 'UPDATE `' + table + '` SET ' + set.join(', ') + ' WHERE ' + 
      cond.join(' ' + cond_glue.trim() + ' ');
    return self.query(query);
  });
};

Dbal.prototype.findOne = function(filter) {
  var deferred = q.defer();
  this.find(filter).then(function(res) {
    deferred.resolve(res[0]);
  }, function (err) {
    deferred.reject(err);
  });
  return deferred.promise;
};

Dbal.prototype.find = function (filter, limit, offset) {
  var self = this;

  if(typeof filter === 'string' || typeof filter === 'number') {
    filter = { id: filter };
  } else {
    filter = filter || {};
  }

  return this.conn().then(function (conn) {
    var table = self.table();
    var query_string = [];
    var keys = Object.keys(filter);
    keys.forEach(function (key) {
      query_string.push('`' + key + '` = ' + conn.escape(filter[key]));
    });

    var query;
    if(keys.length === 0) {
      query = 'SELECT * FROM `' + table + '`';
    } else {
      query = 'SELECT * FROM `' + table + '` WHERE ' + query_string.join(', ');
    }

    if(offset) {
      query += ' LIMIT ' + offset + ', ' + limit;
    } else if(limit) {
      query += ' LIMIT ' + limit;
    }

    return self.query(query);
  });
};

module.exports = Dbal;
