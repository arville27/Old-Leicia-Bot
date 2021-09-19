const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    ...new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the song that is currently playing'),
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let subscription = client.subscriptions.get(interaction.guildId);
        if (subscription) {
            subscription.audioPlayer.pause();
            await interaction.reply({
                embeds: [new MessageEmbed().setDescription(':pause_button: **Paused!**')],
            });
        } else {
            await interaction.reply({
                content: ':diamond_shape_with_a_dot_inside:  Currently not playing in this server!',
                ephemeral: true,
            });
        }
    },
};
