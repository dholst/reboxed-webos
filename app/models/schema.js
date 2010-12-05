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
      name: "games",
      columns: [
        "'id' integer primary key not null",
        "'name' text",
        "'image' text",
        "'released' real",
        "'rating' text",
        "'description' text"
      ]
    },

    {
      name: "genres",
      columns: [
        "'id' integer primary key not null",
        "'name' text"
      ]
    },

    {
      name: "movies_genres",
      columns: [
        "'movie_id' integer not null",
        "'genre_id' integer not null"
      ]
    }
  ]
};
