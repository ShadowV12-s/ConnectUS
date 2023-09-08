const sqlite3 = require('sqlite3').verbose();

class Registration {
  constructor(db) {
    this.db = db;
  }

  createRegistration(serviceId, userId) {
    return new Promise((resolve, reject) => {
      this.db.run('INSERT INTO registration (service_id, user_id) VALUES (?, ?)', [serviceId, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }
}

module.exports = Registration;
