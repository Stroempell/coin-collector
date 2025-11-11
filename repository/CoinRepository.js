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
        fetchUrl TEXT,
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
    console.log("deleting from db");
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
        INSERT INTO coins (id, name, country_id, year, url, fetchUrl, amount) 
        VALUES ($id, $name, $country_id, $year, $url, $url, 0)
        ON CONFLICT(id) DO UPDATE SET
          name=excluded.name,
          country_id=excluded.country_id,
          year=excluded.year,
          url=excluded.url,
          fetchUrl=excluded.url
      `);

      for (const coin of coins) {
        //    console.log("Saving started for", coin.name);

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

  getAllCoins: async (sorting, years) => {
    //  console.log("Sorting: ", sorting)
    //  console.log("Years: ", years)

    // Validate the input to avoid injection
    const direction = sorting === "DESC" ? "DESC" : "ASC";

    // returns coins joined with countries to show country name
    // can't directly use parameters in query, so have to build it dynamically
    let query = `
    SELECT coins.id, coins.name, coins.year, coins.url, coins.fetchUrl, coins.amount, coins.condition, countries.name as country_name
    FROM coins
    JOIN countries ON coins.country_id = countries.id
  `;

    // if years are specified, search for specific years
    if (years && years.length > 0) {
      const placeholders = years.map(() => "?").join(", "); // otherwise maybe sql injection
      query += ` WHERE coins.year IN (${placeholders})`;
    }

    // always order by year in the chosen direction
    query += ` ORDER BY coins.year ${direction}`;

    // if no years are specified, params should be empty
    const params = years && years.length > 0 ? years : [];

    return await db.getAllAsync(query, params);
  },

  updateCoin: async (coin) => {
    console.log("Updating coin to following vars: ", coin);
    const statement = await db.prepareAsync(
      "UPDATE coins SET condition=$condition, amount=$amount, url=$url WHERE id=$id"
    );

    try {
      await statement.executeAsync({
        $condition: coin.condition,
        $amount: coin.amount,
        $id: coin.id,
        $url: coin.url,
      });
    } finally {
      await statement.finalizeAsync();
    }
  },

  resetCoinUrl: async (coin) => {
    const statement = await db.prepareAsync(
      "UPDATE coins SET url=fetchUrl WHERE id=$id"
    );
    try {
      await statement.executeAsync({
        $id: coin.id,
      });
    } finally {
      await statement.finalizeAsync();
    }
    console.log("url should be reset");
  },

  getAllCountries: async (searchQuery) => {
    //  console.log("get all countries called with query: ", searchQuery);

    // Start with base query
    let query = `
      SELECT countries.*, 
             count(case when coins.amount > 0 then 1 END) as owned_coins, 
             count(coins.id) as max_coins
      FROM countries
      LEFT JOIN coins ON countries.id = coins.country_id
    `;

    // if there is a search query, add filter
    if (searchQuery && searchQuery.toString().trim().length > 0) {
      query += ` WHERE LOWER(countries.name) LIKE LOWER(?)`;
      //     console.log("WHERE statement added");
    }

    query += ` GROUP BY countries.id 
               ORDER BY countries.name ASC`;

    // if search query is provided, use it as parameter with wildcards
    // wildcards can't be added in the upper part for some reason
    const params =
      (searchQuery && searchQuery.trim().length) > 0
        ? [`%${searchQuery}%`]
        : [];

    return await db.getAllAsync(query, params);
  },

  getCoinsByCountry: async (countryName, sorting, years) => {
    // Validate the sorting input to prevent SQL injection
    const direction = sorting === "DESC" ? "DESC" : "ASC";

    // Start with base query
    let query = `
    SELECT coins.id, coins.name, coins.year, coins.url, coins.fetchUrl, coins.amount, coins.condition, countries.name as country_name 
    FROM coins 
    JOIN countries ON coins.country_id = countries.id
    WHERE countries.name = ?
  `;

    // If years are specified, filter by them
    if (years && years.length > 0) {
      const placeholders = years.map(() => "?").join(", "); // prevent SQL injection
      query += ` AND coins.year IN (${placeholders})`;
    }

    // Add sorting direction
    query += ` ORDER BY coins.year ${direction}`;

    // Parameters: first is country name, then years (if any)
    const params =
      years && years.length > 0 ? [countryName, ...years] : [countryName];

    return await db.getAllAsync(query, params);
  },

  getCoinAmount: async () => {
    return await db.getAllAsync(`
      SELECT count(case when coins.amount > 0 then 1 END) as allOwnedCoins, count(coins.id) as allMaxCoins
      from coins
      `);
  },

  getCountryAmounts: async () => {
    return await db.getAllAsync(`
      SELECT count(distinct case when coins.amount > 0 then countries.id END) as allOwnedCountries, count(distinct countries.id) as allMaxCountries
      from countries
      left join coins on countries.id = coins.country_id
      `);
  },

  getTopCountryAmounts: async () => {
    return await db.getAllAsync(`
      SELECT countries.name as name, count(distinct CASE when coins.amount > 0 then coins.id END) as ownedCoins
      FROM countries
      JOIN coins on countries.id = coins.country_id
      GROUP BY countries.id
      ORDER BY ownedCoins DESC
      LIMIT 3
      `);
  },

  getPercentageCountries: async () => {
    return await db.getAllAsync(`
      SELECT countries.name as name, 
      COUNT(DISTINCT CASE WHEN coins.amount > 0 THEN coins.id END) * 1.0 / COUNT(coins.id) 
        AS percentage
      FROM countries
      JOIN coins ON countries.id = coins.country_id
      GROUP BY countries.id
      ORDER BY percentage DESC;
      `);
  },

  getAllYears: async () => {
    let rows = await db.getAllAsync(`
        SELECT DISTINCT year
        from coins
        ORDER BY year ASC
      `);

    return rows.map((row) => row.year);
  },
};
