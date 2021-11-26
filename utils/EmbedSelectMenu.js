const { MessageButton, MessageActionRow, CommandInteraction } = require('discord.js');
const resp = require('../responses/MusicCommandsResponse');
const { embedResponse } = require('../utils/Utility');
const { promisify } = require('util');
const { bold } = require('@discordjs/builders');
const wait = promisify(setTimeout);

/**
 * Creates a select menu embed
 * @param {CommandInteraction} interaction
 * @param {MessageActionRow} row
 * @param {MessageButton[]} buttonList
 * @param {number} timeout
 * @returns
 */
const selectMenu = async (client, interaction, row, onCollectCallback, isMusic = false) => {
    //has the interaction already been deferred? If not, defer the reply.
    if (interaction.deferred === false) {
        await interaction.deferReply();
    }

    const master = await interaction.editReply({
        embeds: [embedResponse(resp.others.selectMenuPrompt)],
        components: [row],
        fetchReply: true,
    });

    // Selection Menu collector
    const filter = (componentInteraction) => {
        if (componentInteraction.user.id === interaction.user.id) return true;
        interaction.channel
            .send({ embeds: [resp.filterMessage(interaction)] })
            .then(async (msg) => {
                await wait(8_000);
                msg.delete();
            })
            .catch(() => void 0);
        return false;
    };

    const collector = master.createMessageComponentCollector({
        filter,
        max: 1,
        time: 120 * 1000,
        componentType: 'SELECT_MENU',
    });

    collector.on('collect', onCollectCallback);

    collector.on('end', async (collections) => {
        if (!master.deleted) {
            const embed = isMusic
                ? await resp.selectedMenuMessage(collections.first().values[0])
                : embedResponse({ msg: bold('Already selected'), color: '#0070eb' });
            const res = collections.size > 0 ? embed : resp.timeoutHasBeenReached(120);
            await master
                .edit({
                    embeds: [res],
                    components: [],
                })
                .catch(() => console.log('[ERROR] Select menu already deleted'));
        }
    });

    return master;
};

module.exports = selectMenu;
