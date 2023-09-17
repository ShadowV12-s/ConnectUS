const sqlite3 = require('sqlite3').verbose();

class Registration {
  constructor(db) {
    this.db = db;
  }

  createRegistration(serviceId, userId) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('INSERT INTO registration (service_id, user_id) VALUES (?, ?)');
      stmt.run(serviceId, userId, function(err) {
        stmt.finalize(); // finalize the statement after running to release resources

        if (err) {
          reject(err);
        } else {
          resolve({ message: 'Registration successful', registrationId: this.lastID });
        }
      });
    });
  }  
}

module.exports = Registration;
