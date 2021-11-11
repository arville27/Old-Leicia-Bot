const { Client, CommandInteraction, GuildMember, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder, bold } = require('@discordjs/builders');
const { getGuildSubscription } = require('../../utils/MusicCommands').mc;
const { embedResponse } = require('../../utils/Utility');
const resp = require('../../responses/MusicCommandsResponse');

module.exports = {
    ...new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Loop a entire queue or a current song')
        .addStringOption((input) =>
            input
                .addChoices([
                    ['queue', 'queue'],
                    ['song', 'song'],
                ])
                .setDescription('Loop options')
                .setName('option')
                .setRequired(true)
        ),
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        await interaction.deferReply();

        // check if user in voice channel
        if (interaction.member instanceof GuildMember && !interaction.member.voice.channel) {
            return await interaction.followUp({
                embeds: [embedResponse(resp.others.notInVoiceChannel)],
            });
        }

        const subscription = getGuildSubscription(client, interaction);

        if (!subscription) {
            return await interaction.followUp({
                embeds: [embedResponse(resp.others.noSubscriptionAvailable)],
            });
        }

        let { queue, song } = subscription.loop;
        const option = interaction.options.getString('option');
        let embed;
        if (option === 'song' && !queue) {
            subscription.loop = { queue: queue, song: !song };
            embed = new MessageEmbed().setDescription(bold(`Loop track: ${!song ? 'ON' : 'OFF'}`));
        } else if (option === 'queue' && !song) {
            subscription.loop = { queue: !queue, song: song };
            embed = new MessageEmbed().setDescription(bold(`Loop queue: ${!queue ? 'ON' : 'OFF'}`));
        } else {
            embed = new MessageEmbed().setDescription(`:x: ${bold('Wait, thats illegal!')}`);
            return await interaction.followUp({ embeds: [embed] });
        }
        await interaction.followUp({ embeds: [embed] });
    },
};
