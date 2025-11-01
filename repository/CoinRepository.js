import {
  openDatabaseAsync,
  getAllAsync,
  execAsync,
  prepareAsync,
} from "expo-sqlite";

let db;

export const initializeDB = async () => {
  try {
    db = await openDatabaseAsync("coinsdb"); // open once

    // Create countries table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS countries (
        id INTEGER PRIMARY KEY, 
        name TEXT, 
        url TEXT
      )
    `);

    // Create coins table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS coins (
        id INTEGER PRIMARY KEY, 
        name TEXT, 
        country_id INTEGER NOT NULL, 
        year INTEGER, 
        condition TEXT, 
        amount INTEGER, 
        url TEXT,
        FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE SET NULL ON UPDATE CASCADE
      )
    `);

    console.log("database initialized");
  } catch (error) {
    console.error("Could not open database: ", error);
  }
};

export const CoinRepository = {
  /* 
    all methods for coins
    separated from screens for single responsibility
  */

  resetDB: async () => {
    console.log("deleting db");
    await db.execAsync("DELETE FROM coins");
    await db.execAsync("DELETE FROM countries");

    /*
    await db.execAsync("PRAGMA foreign_keys = OFF"); // disable FK temporarily
    await db.execAsync("DROP TABLE IF EXISTS coins");
    await db.execAsync("DROP TABLE IF EXISTS countries");
    await db.execAsync("PRAGMA foreign_keys = ON"); // re-enable FK
    */
  },

  // only for debugging
  checkDB: async () => {
    try {
      // List all tables
      const tablesResult = await db.getAllAsync(`
        SELECT name FROM sqlite_master WHERE type='table';
      `);
      console.log("All tables:", tablesResult);

      // If coins table exists, show its structure and data
      if (tablesResult.some((t) => t.name === "coins")) {
        const columns = await db.getAllAsync("PRAGMA table_info(coins);");
        console.log("coins table: ", columns);

        const rows = await db.getAllAsync("SELECT * FROM coins;");
        console.log("coins data: ", rows);
      } else {
        console.log("coins doesn't exist");
      }

      // If countries table exists, show its data
      if (tablesResult.some((t) => t.name === "countries")) {
        const rows = await db.getAllAsync("SELECT * FROM countries;");
        console.log("countries data: ", rows);
      } else {
        console.log("countries doesn't exist");
      }
    } catch (err) {
      console.error("idk man: ", err);
    }
  },

  populateDB: async () => {
    try {
      // fetch countries first
      const countryResponse = await fetch(
        "http://192.168.101.104:8080/api/countries"
      );
      if (!countryResponse.ok) throw new Error("Failed to fetch countries");
      const countries = await countryResponse.json();

      // begin transaction for countries
      await db.execAsync("BEGIN TRANSACTION");
      const countryStmt = await db.prepareAsync(`
        INSERT INTO countries (id, name, url) 
        VALUES ($id, $name, $url)
        ON CONFLICT(id) DO UPDATE SET name=excluded.name, url=excluded.url
      `);

      for (const country of countries) {
        await countryStmt.executeAsync({
          $id: country.id,
          $name: country.name,
          $url: country.url || null,
        });
      }

      await countryStmt.finalizeAsync();
      await db.execAsync("COMMIT");
      console.log("All countries inserted");

      // fetch coins when countries are loaded
      const coinResponse = await fetch("http://192.168.101.104:8080/api/coins");
      if (!coinResponse.ok) throw new Error("Failed to fetch coins");
      const coins = await coinResponse.json();

      // begin transaction for coins
      await db.execAsync("BEGIN TRANSACTION");
      const coinStmt = await db.prepareAsync(`
        INSERT INTO coins (id, name, country_id, year, url, amount) 
        VALUES ($id, $name, $country_id, $year, $url, 0)
        ON CONFLICT(id) DO UPDATE SET
          name=excluded.name,
          country_id=excluded.country_id,
          year=excluded.year,
          url=excluded.url
      `);

      for (const coin of coins) {
        console.log("Saving started for", coin.name);

        // Find country_id based on country name from fetched country list
        const country = countries.find((c) => c.name === coin.country);
        if (!country) {
          console.warn("Country not found for coin:", coin.name);
          continue;
        }

        await coinStmt.executeAsync({
          $id: coin.id,
          $name: coin.name,
          $country_id: country.id,
          $year: coin.year,
          $url: coin.url || null,
        });
      }

      await coinStmt.finalizeAsync();
      await db.execAsync("COMMIT"); // necessary because otherwise big problems
      console.log("All coins inserted in single transaction");
    } catch (err) {
      await db.execAsync("ROLLBACK");
      console.error("Insert failed:", err);
    }
  },

  getAllCoins: async () => {
    // returns coins joined with countries to show country name
    return await db.getAllAsync(`
      SELECT coins.id, coins.name, coins.year, coins.url, coins.amount, coins.condition, countries.name as country_name 
      FROM coins 
      JOIN countries ON coins.country_id = countries.id
    `);
  },

  updateCoin: async (coin) => {
    console.log("Updating coin to following vars: ", coin);
    const statement = await db.prepareAsync(
      "UPDATE coins SET condition=$condition, amount=$amount WHERE id=$id"
    );

    try {
      await statement.executeAsync({
        $condition: coin.condition,
        $amount: coin.amount,
        $id: coin.id,
      });
    } finally {
      await statement.finalizeAsync();
    }
  },

  getAllCountries: async () => {
    return await db.getAllAsync(`
        SELECT countries.*, count(case when coins.amount > 0 then 1 END) as owned_coins, count(coins.id) as max_coins
        from countries
        left join coins on countries.id = coins.country_id
        group by countries.id
        order by countries.name asc
      `);
  },

  getCoinsByCountry: async (countryName) => {
    return await db.getAllAsync(
      `
    SELECT coins.id, coins.name, coins.year, coins.url, coins.amount, coins.condition, countries.name as country_name 
    FROM coins 
    JOIN countries ON coins.country_id = countries.id
    WHERE countries.name=$country_name
  `, //when using variables, it should also be sql-injection proof
      { $country_name: countryName }
    );
  },

  getCoinAmount: async () => {
    return await db.getAllAsync(`
      SELECT count(case when coins.amount > 0 then 1 END) as allOwnedCoins, count(coins.id) as allMaxCoins
      from coins
      `)
  },
};
