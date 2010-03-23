SCHEMA = {
  version: "1",

  tables: [
    {
      name: "movies",
      columns: [
        "'id' integer primary key not null",
        "'name' text",
        "'image' text",
        "'released' real",
        "'rating' text",
        "'running_time' text",
        "'actors' text",
        "'genre' text",
        "'description' text"
      ]
    }
  ]
};