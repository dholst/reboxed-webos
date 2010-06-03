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
        "'yahoo_rating' text",
        "'description' text"
      ]
    },

    {
      name: "categories",
      columns: [
        "'id' integer primary key not null",
        "'name' text"
      ]
    },

    {
      name: "movies_categories",
      columns: [
        "'movie_id' integer not null",
        "'category_id' integer not null"
      ]
    }
  ]
};