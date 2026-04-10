// import { Client, Events, GatewayIntentBits, Collection, ChannelType, TextChannel } from 'discord.js';
// import { token } from './config.json';
// import fs from 'fs';
// import path from 'path';
// import { GameManager } from "./core/GameManager";

// declare module 'discord.js' {
//   interface Client {
//     commands: Collection<string, any>;
//     gameManager: GameManager;
//   }
// }

// const client = new Client({
//   intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
// });

// export const gameManager = new GameManager();

// client.commands = new Collection();
// client.gameManager = gameManager;

// /* Load commands */
// const commandsPath = path.join(__dirname, 'bot/commands');
// const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

// for (const file of commandFiles) {
//     const command = require(`./bot/commands/${file}`);
//     client.commands.set(command.data.name, command);
// }

// /* Ready event */
// client.once(Events.ClientReady, (readyClient: Client<true>) => {
//   console.log(`Ready! Logged in as ${readyClient.user.tag}`);
// });

// /* Interaction handler */
// client.on('interactionCreate', async interaction => {

//     if (!interaction.isChatInputCommand()) return;

//     const command = client.commands.get(interaction.commandName);
//     if (!command) return;

//     try {
//         await command.execute(interaction);
//     } catch (error) {
//         console.error(error);
//         await interaction.reply({
//             content: 'Erreur lors de l\'exécution de la commande.',
//             ephemeral: true
//         });
//     }
// });

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

// client.login(token);

import '@sapphire/plugin-logger/register';
import { SapphireClient, LogLevel } from '@sapphire/framework';
import { ApplicationCommandRegistries } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import { config } from './config';

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
    ApplicationCommandRegistries.setDefaultGuildIds([config.guildId]);
    await client.login(config.token);
}

main().catch(error => {
    client.logger.fatal(error);
    process.exit(1);
});