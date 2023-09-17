CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      googleid TEXT
      email TEXT,
      name TEXT,
      picture TEXT
);


CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        serviceName TEXT,
        email TEXT,
        description TEXT,
        date TEXT,
        time TEXT,
        time2 TEXT,
        hours INTEGER,
        address TEXT
);

CREATE TABLE IF NOT EXISTS registration (
    user_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

