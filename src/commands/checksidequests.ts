import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getDiscordUser } from "../DB_Factory";

export const data = new SlashCommandBuilder()
  .setName("checksidequests")
  .setDescription("Replies with Pong!")
  .addUserOption(option =>
    option
      .setName('target')
      .setDescription('The member to kick')
      .setRequired(true))

export async function execute(interaction: CommandInteraction) {
  const target = interaction.options.getUser('target');

  if (target) {
    const user = await getDiscordUser(target.id)

    if (user) {
      const minutes = (user.questTotalTime / 60).toFixed(2);
      return interaction.reply(`The user <@${user.discordId}> currently has ${user.questTracker} SideQuests with a total time of ${minutes} minutes`);

    } else {
      return interaction.reply('It was not possible to retrieve information about that user!');
    }
  } else {
    return interaction.reply('It was not possible to retrieve information about that user!');
  }
}
