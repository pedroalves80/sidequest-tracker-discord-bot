import { MongoClient, ServerApiVersion } from "mongodb";
import { IUser } from "./interfaces/DB";
import { GuildMember } from "discord.js";

const client = new MongoClient(process.env.mongodb || "", {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function getDiscordUser(discordId: string): Promise<IUser | null> {
  try {
    const database = client.db("sidequest-tracker");
    const users = database.collection("users");

    const filterQuery = { discordId: discordId };

    const user = await users.findOne(filterQuery);

    return user as unknown as IUser;
  } catch (Error: unknown) {
    return null;
  }
}

export async function setDiscordUser(discordUser: GuildMember): Promise<boolean> {
  try {
    const database = client.db("sidequest-tracker");
    const users = database.collection("users");

    const user: IUser = {
      discordId: discordUser.user.id,
      discordName: discordUser.user.username,
      questTracker: 0,
      questTotalTime: 0,
      currentlyOnQuest: false,
      startingQuestDate: new Date
    }

    const hasUser = await getDiscordUser(discordUser.user.id)


    if (hasUser) return true

    const result = await users.insertOne(user as any)

    return !!result.insertedId
  } catch (Error: unknown) {
    return false;
  }
}

export async function updateDiscordUser(discordUser: IUser): Promise<boolean> {
  try {
    const database = client.db("sidequest-tracker");
    const users = database.collection("users");

    const filter = { discordId: discordUser.discordId };

    const options = { upsert: false };

    const updateDoc = {
      $set: {
        currentlyOnQuest: discordUser.currentlyOnQuest,
        questTracker: discordUser.questTracker,
        startingQuestDate: discordUser.startingQuestDate,
        questTotalTime: discordUser.questTotalTime
      }
    }

    const result = await users.updateOne(filter, updateDoc, options);

    return !!result

  } catch (error: unknown) {
    console.log('Error Trying to update user')
    return false;
  }
}
