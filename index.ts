import { Command } from 'commander';
import { getUserId, getAvatarItems, idsToCommand } from "./modules/steal.ts";
import { writeToCache, checkCache, getCache, clearCache } from "./modules/database.ts";
import { printTable } from 'console-table-printer';
import wordwrap from 'wordwrapjs'
import noblox from "noblox.js"

const program = new Command();

const cooldown: number = 16
// Gets a random hex color.
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

program
  .name('wardrobe')
  .description('An outfit manager for Roblox Adonis')
  .version('1.0.0');

program
  .command('steal <nameOrId>')
  .description('Steal the current outfit of a user')
  .option("-c --cache", "Caches the avatar of a player")
  .option("-C --cached", "Prioritizes cached outfits instead of those from Roblox. Significantly decreases stealing time when enough avatars are cached.")
  .option("-i --id", "Get avatar items using Roblox ID")
  .action(async (nameOrId, options) => {
    try {
      const useId = options.id;
      const userId = useId ? nameOrId : await getUserId(nameOrId);
      const idToUse = useId ? nameOrId : userId;
      if (options.cached) {
        const cachedResult = await checkCache(idToUse);
        if (cachedResult) {
          console.log(`${Bun.color("green", "ansi")} * Cache was used!\u001b[0m`);
          console.log(Bun.color("white", "ansi"));
          // Stole this from SO and modified it to do what i want but seems really smart.
          // Will color every 200th character so that you know where to start copying from, considering 200 is the roblox chat char limit.
          const result = [...cachedResult.command].map((l,i) => (i + 1) % 200 ? l : Bun.color(getRandomColor(),"ansi")+l)
          console.log(result.join(""));
          return;
        } else {
          console.log(`${Bun.color("green", "ansi")} * --cached flag was used, however this user was not cached.\u001b[0m`);
        }
      }

      console.log(`${Bun.color("green", "ansi")} * Calling Roblox...`);
      const avatarItems = await getAvatarItems(idToUse);
      const command = idsToCommand(avatarItems).join("|");
      console.log(Bun.color("white", "ansi"));
      const result = [...command].map((l,i) => (i + 1) % 200 ? l : Bun.color(getRandomColor(),"ansi")+l)
      console.log(result.join(""));

      if (options.cache) {
        console.log(`${Bun.color("green", "ansi")} * Caching user.\u001b[0m`);
        const username = useId ? await noblox.getUsernameFromId(idToUse) : nameOrId;
        await writeToCache(username, idToUse, command);
      }
    } catch (error) {
      console.error(error);
    }
  });

program
  .command('update-cache')
  .description('Update stolen avatar cache')
  .action(async () => {
    let cache = getCache();
    const length = cache.length;
    let count = 1;
    console.log(`${Bun.color("green", "ansi")} * Due to Roblox API limitations, the cooldown between each update is ${cooldown} seconds. Estimated update time: ${length*cooldown} seconds.`);
    for (const element of cache) {
      try {
        console.log(`${Bun.color("white", "ansi")} >>> Updating (${count} of ${length}) ${Bun.color("green", "ansi")} ${element.name} (${element.id})`);
        let avatarItems = await getAvatarItems(element.id);
        const username = await noblox.getUsernameFromId(element.id);
        await writeToCache(username, element.id, idsToCommand(avatarItems).join("|"));
        console.log(`${Bun.color("white", "ansi")} >>> Updated (${count} of ${length}) ${Bun.color("green", "ansi")} ${element.name} (${element.id})`);
      } catch (error) {
        console.error(`Error updating ${element.name} (${element.id}):`, error);
      }
      await new Promise(r => setTimeout(r, cooldown*1000));
      count++;
    }
  });

program
  .command('list-cache')
  .description('List stolen avatar cache')
  .action(() => {
    console.log(getCache());
  });

program
  .command('clear-cache')
  .description('Clear all cache')
  .action(() => {
    clearCache()
    console.log("All cache cleared");
  });

program.parse();
