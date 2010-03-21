SCHEMA = {
  version: "1",

  tables: [
    {
      name: "movies",
      columns: [
        "'id' integer primary key not null",
        "'name' text",
        "'image' text",
        "'released' real"
      ]
    }
  ]
};