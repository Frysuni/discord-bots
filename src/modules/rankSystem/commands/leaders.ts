import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ButtonInteraction, APIEmbed } from 'discord.js';
import { getTopMembers } from '../database';


export const data = new SlashCommandBuilder()
    .setName('leaders')
    .setNameLocalization('ru', 'лидеры')

    .setDescription('Показать топ участников.')

    .setDMPermission(false);

export async function execute(interaction: ChatInputCommandInteraction) {
    const leadersEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Лидеры рейтинга')
            .setFooter({ text: 'Страница #1' });

    const pagingButtons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('prevpage')
                .setEmoji('◀️')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('nextpage')
                .setEmoji('▶️')
                .setStyle(ButtonStyle.Secondary));

    const leaders = await getTopMembers(1);

    if (leaders.length == 0) {
        interaction.reply({ content: 'На сервере еще нет лидеров, как такое может быть?', ephemeral: true });
        return;
    }

    let i = 1;
    leaders.forEach(record => {
        const memberName = interaction.guild.members.cache.get(record.memberId)?.displayName;

        if (!memberName) return;

        leadersEmbed.addFields({
            name: `${i}. ${memberName}`,
            value: `Уровень: **${record.level}** | XP: **${record.exp}**`
        });
        i++;

    });

    interaction.reply({ embeds: [leadersEmbed], components: [pagingButtons] });
}

export async function pagingLeaders(interaction: ButtonInteraction) {
    const embed: APIEmbed = JSON.parse(JSON.stringify(interaction.message.embeds[0].data));
    let page = parseInt(embed.footer.text.split('#')[1]);

    if (interaction.customId === 'nextpage') page++;
    if (interaction.customId === 'prevpage') page--;
    if (page == 0) {
        interaction.reply({ content: 'Это уже и так самая-самая первая страница, дальше некуда :)', ephemeral: true });
        return;
    }
    if (interaction.member.user.id != interaction.message.interaction.user.id) {
        interaction.reply({ content: 'Управлять списком может только тот, кто его вызвал.', ephemeral: true });
        return;
    }
    if (embed.fields.length < 10) {
        interaction.reply({ content: 'Это последняя страница.', ephemeral: true });
        return;
    }

    delete embed.fields;
    embed.fields = [];

    const leaders = await getTopMembers(page);

    let i = page * 10 + 1;
    leaders.forEach(record => {
        const memberName = interaction.guild.members.cache.get(record.memberId)?.displayName;

        if (!memberName) return;

        embed.fields.push({
            name: `${i}. ${memberName}`,
            value: `Уровень: **${record.level}** | XP: **${record.exp}**`
        });
        i++;
    });

    embed.footer.text = 'Страница #' + ++page;

    interaction.message.edit({ embeds: [embed] });
    interaction.deferUpdate();
}
