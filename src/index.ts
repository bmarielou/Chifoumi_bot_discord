<<<<<<< HEAD
import dotenv from 'dotenv';
import { Client, Events, GatewayIntentBits, Collection } from 'discord.js';
=======
import { Client, Events, GatewayIntentBits, Collection, ChannelType, TextChannel } from 'discord.js';
>>>>>>> 80886e101b6a129e4be085eed37ac1f319d19eff
import { token } from './config.json';
import fs from 'fs';
import path from 'path';
import { GameManager } from "./core/GameManager";

dotenv.config();

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, any>;
    gameManager: GameManager;
  }
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

export const gameManager = new GameManager();

client.commands = new Collection();
client.gameManager = gameManager;

/* Load commands */
const commandsPath = path.join(__dirname, 'bot/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const command = require(`./bot/commands/${file}`);
    client.commands.set(command.data.name, command);
}

/* Ready event */
client.once(Events.ClientReady, (readyClient: Client<true>) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

/* Interaction handler */
client.on('interactionCreate', async interaction => {

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'Erreur lors de l\'exécution de la commande.',
            ephemeral: true
        });
    }
});

/* Guild member remove handler */
client.on(Events.GuildMemberRemove, async member => {
    for (const [channelId, game] of gameManager.games) {
        const player = game.players.find(p => p.id === member.id);
        if (player) {
            player.isActive = false;
            const channel = client.channels.cache.get(channelId);
            if (channel && channel.type === ChannelType.GuildText) {
                await (channel as TextChannel).send(`<@${member.id}> a quitté le serveur et est retiré de la partie.`);
            }
        }
    }
});

client.login(token);