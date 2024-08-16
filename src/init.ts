import { Client, GuildMember, TextChannel } from "discord.js";
import { getDiscordUser, setDiscordUser, updateDiscordUser } from "./DB_Factory";

export default async function __init(client: Client) {
  client.on("guildAvailable", async (guild) => {
    const members = await guild.members.fetch();

    members.forEach((member: GuildMember) => {
      if (!member.user.bot) {
        setDiscordUser(member)
      }
    });
  })

  client.on('voiceStateUpdate', async (oldState, newState) => {
    const user = await getDiscordUser(newState.id)
    if (newState.selfDeaf) {

      if (user) {
        const tracker = user.questTracker + 1;
        const startingQuestDate = new Date();

        user.currentlyOnQuest = true;
        user.questTracker = tracker;
        user.startingQuestDate = startingQuestDate;

        await updateDiscordUser(user);

        const channel = newState.guild.channels.cache.get("709448658084560906")

        if (channel && channel instanceof TextChannel) {
          channel.send(`The User <@${newState.member?.id}> Has Entered a SideQuest!`)
        }
      } else if (newState.member) {
        await setDiscordUser(newState.member)

        const newUser = await getDiscordUser(newState.id);

        if (newUser) {
          const tracker = newUser.questTracker + 1;
          const startingQuestDate = new Date();

          newUser.currentlyOnQuest = true;
          newUser.questTracker = tracker;
          newUser.startingQuestDate = startingQuestDate;

          await updateDiscordUser(newUser);

          const channel = newState.guild.channels.cache.get("709448658084560906")

          if (channel && channel instanceof TextChannel) {
            channel.send(`The User <@${newState.member?.id}> Has Entered a SideQuest!`)
          }
        }
      }
    } else if (!newState.selfDeaf && user?.currentlyOnQuest) {
      const seconds = (new Date().getTime() - user.startingQuestDate.getTime()) / 1000;

      user.questTotalTime = user.questTotalTime + seconds;
      user.currentlyOnQuest = false;

      await updateDiscordUser(user);

      const channel = newState.guild.channels.cache.get("709448658084560906")

      if (channel && channel instanceof TextChannel) {
        channel.send(`The User <@${newState.member?.id}> Has Left a SideQuest!`)
      }
    }
  });
}
