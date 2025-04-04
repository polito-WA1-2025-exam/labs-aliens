

import sqlite3 from 'sqlite3';
import dayjs from 'dayjs';

const db = new sqlite3.Database('surplusfood.db', (err) => {
  if (err) {
    console.error("❌ Error opening database:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
    createTables();
  }
});

const createTables = () => {
  // Establishments
  db.run(`
    CREATE TABLE IF NOT EXISTS Establishment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      cuisine_type TEXT
    );
  `);

  // Bags
  db.run(`
    CREATE TABLE IF NOT EXISTS Bag (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT CHECK(type IN ('surprise', 'regular')) NOT NULL,
      size TEXT CHECK(size IN ('small', 'medium', 'large')) NOT NULL,
      price REAL NOT NULL,
      pickup_start TEXT NOT NULL,
      pickup_end TEXT NOT NULL,
      state TEXT CHECK(state IN ('available', 'reserved')) NOT NULL DEFAULT 'available',
      establishment_id INTEGER NOT NULL,
      FOREIGN KEY(establishment_id) REFERENCES Establishment(id)
    );
  `);

  // Users
  db.run(`
    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      birth_year INTEGER
    );
  `);

  // Reservations
  db.run(`
    CREATE TABLE IF NOT EXISTS Reservation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES User(id)
    );
  `);

  // Reservation Items
  db.run(`
    CREATE TABLE IF NOT EXISTS ReservationItem (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reservation_id INTEGER,
      bag_id INTEGER,
      FOREIGN KEY(reservation_id) REFERENCES Reservation(id),
      FOREIGN KEY(bag_id) REFERENCES Bag(id)
    );
  `);

  console.log("✅ Tables created successfully.");
};

const insertEstablishment = (name, address, phone, cuisine) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO Establishment (name, address, phone, cuisine_type) VALUES (?, ?, ?, ?)`,
      [name, address, phone, cuisine],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
};

const insertBag = (type, size, price, pickupStart, pickupEnd, state, establishmentId) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO Bag (type, size, price, pickup_start, pickup_end, state, establishment_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [type, size, price, pickupStart, pickupEnd, state, establishmentId],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
};

const insertUser = (firstName, lastName, birthYear) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO User (first_name, last_name, birth_year) VALUES (?, ?, ?)`,
      [firstName, lastName, birthYear],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
};

const findBagsByEstablishment = (establishmentId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM Bag WHERE establishment_id = ?`,
      [establishmentId],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
};

// 🔄 Sample data insert
const insertSampleData = async () => {
  try {
    const estId = await insertEstablishment("FreshMart", "123 Market St", "123-456-7890", "Grocery");
    const userId = await insertUser("Hasti", "Doe", 1996);

    await insertBag(
      "regular",
      "medium",
      5.99,
      dayjs("2025-04-05T10:00").format("YYYY-MM-DDTHH:mm"),
      dayjs("2025-04-05T11:00").format("YYYY-MM-DDTHH:mm"),
      "available",
      estId
    );

    await insertBag(
      "surprise",
      "large",
      7.50,
      dayjs("2025-04-06T15:00").format("YYYY-MM-DDTHH:mm"),
      dayjs("2025-04-06T16:00").format("YYYY-MM-DDTHH:mm"),
      "available",
      estId
    );

    console.log("🎉 Sample data inserted.");
  } catch (err) {
    console.error("❌ Error inserting sample data:", err.message);
  }
};

// 🔍 Sample query
const testQuery = async () => {
  try {
    const bags = await findBagsByEstablishment(1);
    console.log("📦 Bags for establishment 1:", bags);
  } catch (err) {
    console.error("❌ Query error:", err.message);
  } finally {
    db.close();
  }
};

(async () => {
  await insertSampleData();
  await testQuery();
})();
