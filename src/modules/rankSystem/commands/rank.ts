import { SlashCommandBuilder, AttachmentBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import rankCard from '../canvasCard/rankCard';

export const data = new SlashCommandBuilder()
        .setName('rank')
        .setNameLocalization('ru', 'ранг')

        .setDescription('Узнать ранг свой ранг или ранг участника.')

        .addUserOption(option => option
            .setName('member')
            .setNameLocalization('ru', 'участник')

            .setDescription('Оставьте путсым, чтобы узнать свой ранг.'))

        .setDMPermission(false);

export async function execute(interaction: ChatInputCommandInteraction) {
    const member = (interaction.options.getMember('member') ?? interaction.member) as GuildMember;

    if (member.user.bot) {
        interaction.reply({ content: 'Бот не человек и не имеет ранга :)', ephemeral: true });
        return;
    }

    interaction.reply({ files: [new AttachmentBuilder(await rankCard(member), { name: `NeverPixel-rank-${member.user.username}.png` })] });
}