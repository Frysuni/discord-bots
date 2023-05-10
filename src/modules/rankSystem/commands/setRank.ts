import envConfig from '@env';
import { SlashCommandBuilder, AttachmentBuilder, ChatInputCommandInteraction, GuildMember, PermissionFlagsBits } from 'discord.js';
import { calculateExpForLvl } from '..';
import rankCard from '../canvasCard/rankCard';
import { updateMember } from '../database';

export const data = new SlashCommandBuilder()
    .setName('set_rank')
    .setNameLocalization('ru', 'установить_ранг')

    .setDescription('Изменить уровень участнику.')

    .addUserOption(option => option
        .setName('member')
        .setNameLocalization('ru', 'участник')

        .setDescription('Выберите участника, которому нужно изменить уровень.')
        .setRequired(true))

    .addIntegerOption(level => level
        .setName('level')
        .setNameLocalization('ru', 'уровень')

        .setDescription('Укажите требуемый уровень участнику.')

        .setRequired(true))

    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false);


export async function execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.options.getMember('member') as GuildMember;
    const level = interaction.options.getInteger('level');
    const exp = calculateExpForLvl(level);

    if (member.user.bot) {
        interaction.reply({ content: 'Бот не человек и не имеет ранга :)', ephemeral: true });
        return;
    }

    const result = await updateMember({ memberId: member.id, level, exp });
    if (result == 'not_found') {
        interaction.reply({ ephemeral: true, content: 'Данный участник еще не зарегестрирован и имеет уровень 1 с опытом 0.' });
        return;
    }

    if (level < envConfig.rankSystem.rewardRoleLvl) {
        const rewardRole = interaction.guild.roles.cache.get(envConfig.rankSystem.rewardRoleId);
        member.roles.remove(rewardRole);
    }
    if (level >= envConfig.rankSystem.rewardRoleLvl) {
        const rewardRole = interaction.guild.roles.cache.get(envConfig.rankSystem.rewardRoleId);
        member.roles.add(rewardRole);
    }
    await new Promise(res => setTimeout(res, 300));
    interaction.reply({ ephemeral: true, content: 'Успешно!', files: [new AttachmentBuilder(await rankCard(member), { name: `NeverPixel-rank-${member.user.username}.png` })] });
}