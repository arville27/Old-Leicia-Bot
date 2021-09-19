const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    ...new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip to the next song in the queue'),
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let subscription = client.subscriptions.get(interaction.guildId);
        if (subscription) {
            // Calling .stop() on an AudioPlayer causes it to transition into the Idle state. Because of a state transition
            // listener defined in music/subscription.ts, transitions into the Idle state mean the next track from the queue
            // will be loaded and played.
            if (subscription.audioPlayer.state.status === AudioPlayerStatus.Idle) {
                return await interaction.reply({
                    content: ':diamond_shape_with_a_dot_inside:  The queue is empty',
                    ephemeral: true,
                });
            }
            subscription.skip();
            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(':track_next: **Skipped song!**')
                        .setColor('#0070eb'),
                ],
            });
        } else {
            await interaction.reply({
                content: ':diamond_shape_with_a_dot_inside:  Currently not playing in this server!',
                ephemeral: true,
            });
        }
    },
};
