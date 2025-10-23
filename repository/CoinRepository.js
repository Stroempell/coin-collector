import { openDatabaseAsync, getAllSync, execAsync, executeAsync, runAsync, prepareAsync, finalizeAsync } from 'expo-sqlite';


let db;

export const initializeDB = async () => {
    try {
        db = await openDatabaseAsync('coinsdb'); // open once

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS coins (id INTEGER PRIMARY KEY, name TEXT, country TEXT, 
            year INTEGER, condition TEXT, 
            amount INTEGER, url TEXT)  
        `)

        console.log("database initialized")

    } catch (error) {
      console.error('Could not open database: ', error)
    }
}



export const CoinRepository = {
    /* 
    all methods for coins
    separated from screens for single responsibility
    */


    resetDB: async () => {
        console.log("deleting db")
        await db.execAsync(
            'DELETE FROM coins'
        )
        /*
        await db.execAsync(
            'DROP TABLE IF EXISTS coins'
        )
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
            if (tablesResult.some(t => t.name === 'coins')) {
            const columns = await db.getAllAsync("PRAGMA table_info(coins);");
            console.log("coins table: ", columns);

            const rows = await db.getAllAsync("SELECT * FROM coins;");
            console.log("coins data: ", rows);
            } else {
            console.log("coins doesn't exist");
            }
        } catch (err) {
            console.error("idk man: ", err);
        }
        },


    populateDB: async () => {
    const response = await fetch(`http://192.168.101.104:8080/api/coins`);
    if (!response.ok) throw new Error("Failed to fetch coins");
    const data = await response.json();

    // Wait for all coins to be inserted - otherwise no dynamic update
    await Promise.all(data.map(coin => CoinRepository.addCoin({
        id: coin.id,
        name: coin.name,
        country: coin.country,
        year: coin.year,
        condition: coin.condition || null,
        amount: coin.amount || 0,
        url: coin.url || null,
    })));
    },





    addCoin: async (coin) => {
        console.log("saving stared")
        const statement = await db.prepareAsync(
            'INSERT INTO coins (id, name, country, year, condition, amount, url) VALUES ($id, $name, $country, $year, $condition, $amount, $url)'
        ) //prevents sql injections - https://docs.expo.dev/versions/latest/sdk/sqlite/#prepared-statements

        console.log("saving continued")

        try {
            console.log("saving with vars")
            await statement.executeAsync({
                $id: coin.id,
                $name: coin.name,
                $country: coin.country, 
                $year: coin.year,
                $condition: coin.condition || null,
                $amount: coin.amount || 0,
                $url: coin.url,
            })

        } finally {
            await statement.finalizeAsync();

        }
    },

    getAllCoins: async () => {
        return await db.getAllAsync('SELECT * from coins');
    },

    getCoinById: async (id) => {
        const statement = await db.prepareAsync('SELECT * FROM coins WHERE ID=$id')

        try {
            let result = await statement.executeAsync({
                $id: coin.id,
            })
        } finally {
            await statement.finalizeAsync();
        }
    },

    updateCoin: async (coin) => {
        const statement = await db.prepareAsync(
            'UPDATE coins SET condition=$condition, amount=$amount WHERE id=$id'
        )

        try {
            await statement.executeAsync({
                $condition: coin.condition,
                $amount: coin.amount,
                $id: coin.id 
            })
        } finally {
            await statement.finalizeAsync();
        }
    },

    deleteCoinById: async (id) => {
        const statement = await db.prepareAsync('DELETE FROM coins WHERE id=$id');
        try {
            await statement.executeAsync({ $id: id });
        } finally {
            await statement.finalizeAsync();
        }
    }


}


