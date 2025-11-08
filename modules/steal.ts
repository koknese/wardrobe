import noblox from "noblox.js"

export async function getUserId(username:string) {
  try {
    const userId:number = await noblox.getIdFromUsername(username);
    return userId;
  } catch (error) {
    console.error(`Error getting ID for username ${username}:`, error);
    return null; 
  }
}

// Returns an array
export async function getAvatarItems(id:number) {
  try {
    const wearingAssets: any= await noblox.currentlyWearing(id)
    return wearingAssets.assetIds
  } catch (error) {
    console.error(error);
  }
}

export function idsToCommand(ids: number[]) {
  return ids.map(element => `!hat ${element}`);
}

