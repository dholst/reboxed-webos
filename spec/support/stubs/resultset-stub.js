ResultSetStub = Class.create({
  initialize: function(rows) {
    this.rows = rows;
    this.rows.item = function(index) {
      return rows[index];
    };
  }
});