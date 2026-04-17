// /* Guild member remove handler */
// client.on(Events.GuildMemberRemove, async member => {
//     for (const [channelId, game] of gameManager.games) {
//         const player = game.players.find(p => p.id === member.id);
//         if (player) {
//             player.isActive = false;
//             const channel = client.channels.cache.get(channelId);
//             if (channel && channel.type === ChannelType.GuildText) {
//                 await (channel as TextChannel).send(`<@${member.id}> a quitté le serveur et est retiré de la partie.`);
//             }
//         }
//     }
// });


import '@sapphire/plugin-logger/register';
import { SapphireClient, LogLevel } from '@sapphire/framework';
import { ApplicationCommandRegistries } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import { config } from './config';
import './services';

const client = new SapphireClient({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages
    ],
    logger: {
        level: LogLevel.Debug
    }
});

async function main() {
  client.logger.info('Starting bot...');
  ApplicationCommandRegistries.setDefaultGuildIds([config.guildId]);
  await client.login(config.token);
}

main().catch(error => {
    client.logger.fatal(error);
    process.exit(1);
});