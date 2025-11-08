import { Database } from "bun:sqlite";

/*
Caching and saving system
There will be 2 tables, one for custom avatars, the other one for stolen avatar cache

Stealing note:
By default the app will use the roblox servers for getting avatars instead of the cache.
Will probably add a flag to prioritise using the cache instead of Roblox servers.
*/

// Will run only if the cache table does not exist.
function createCache() {
  using db = new Database("data.sqlite");
  using query = db.query(`
    CREATE TABLE IF NOT EXISTS cache(
      id INT UNIQUE,
      name TEXT NOT NULL,
      command TEXT NOT NULL
    );`);
 query.run()
}

// Creates (if doesnt exist) the place where commands for various outfits will be kept
function createAvatars() {
  using db = new Database("data.sqlite");
  using query = db.query(`
    CREATE TABLE IF NOT EXISTS avatars(
      name TEXT NOT NULL,
      command TEXT NOT NULL
    );
  `);
  query.run()
}

// Updates the cache for all stolen outfits by getting all data, dropping the table and getting refreshed data from roblox servers.
export async function updateCache() {
  using db = new Database("data.sqlite");
  // TODO:
  query.run()
}


// Writes an avatar cache item if doesnt exists, updates an existant one if a record exists.
export function writeToCache(username:string, id:number, command:string) {
  createCache()
  using db = new Database("data.sqlite");
  using query = db.query(`
    INSERT INTO cache(id, name, command) 
    VALUES ($id, $name, $command)
    ON CONFLICT(id) DO UPDATE SET command = excluded.command;
  `);
  query.run({ $id: id, $name:username, $command:command })
}

// Writes an avatar item if doesnt exists, updates an existant one if a record exists.
export function writeAvatarItem(name: string, username:string, command:string) {
  createAvatars()
  using db = new Database("data.sqlite");
  using query = db.query(`
    INSERT INTO cache(id, name, command) 
    VALUES ($id, $name, $command)
    ON CONFLICT(id) DO UPDATE SET command = excluded.command;
  `);
  query.run({ $id: id, $name:username, $command:command })
}

// This will get all cache contents in a JSON format.
export function getCache() {
  using db = new Database("data.sqlite");
  using query = db.query(`
    SELECT * FROM cache;
  `);
  return query.all();
}

export function clearCache() {
  using db = new Database("data.sqlite");
  using query = db.query(`
    DELETE FROM cache;
  `);
  return query.run();
}

// This will get all avatars contents in a JSON format.
export function getAvatars() {
  using db = new Database("data.sqlite");
  using query = db.query(`
    SELECT * FROM avatars;
  `);
  return query.all();
}

// Checks if a user is cached by ID. If user is cached, returns the object. Otherwise returns null.
export async function checkCache(id:number) {
  using db = new Database("data.sqlite");
  using query = db.query(`
    SELECT * FROM cache WHERE id=$id;
  `);
  return query.get({$id:id});
}
// TODO: make this compatible with the ID flag to cut down loading times.
