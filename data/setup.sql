CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT,
      last_name TEXT,
      email TEXT,
      password TEXT
);

CREATE TABLE IF NOT EXISTS registration (
    user_id INTEGER FOREIGN KEY REFERENCES users(id),
    service_id INTEGER FOREIGN KEY REFERENCES services(id),
)