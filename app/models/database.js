Database = Class.create({
  initialize: function() {
    this.databaseName = "reboxed";
  },

  open: function(callback) {
    this.db = openDatabase("ext:" + this.databaseName, SCHEMA.version, this.databaseName, 500000);
    this._executeSchemaStatement(callback, 0);
  },

  execute: function(sql, values, success, failure) {
    this.db.transaction(function(transaction) {
      transaction.executeSql(
        sql,
        values,
        function(transation, resultSet){success(resultSet)},
        function(transaction, error){failure(error.message)}
      );
    });
  },

  _executeSchemaStatement: function(callback, index) {
    if(index >= SCHEMA.tables.length) {
      callback();
    }
    else {
      this.db.transaction(function(transaction) {
        transaction.executeSql(
          this._buildSql(SCHEMA.tables[index]),
          [],
          this._executeSchemaStatement.bind(this, callback, index + 1),
          this._ohShit
        );
      }.bind(this));
    }
  },

  _buildSql: function(table) {
    return "create table if not exists '" + table.name + "' (" + table.columns.join(", ") + ")";
  },

  _ohShit: function(transaction, error) {
    Mojo.Log.error("Database error:", error.message);
  }
});

Database.getInstance = function() {
  if(!Database.__singleton__) {
    Database.__singleton__ = new Database();
  }

  return Database.__singleton__;
};