import dotenv from 'dotenv';
import {
    Client,
    Events,
    GatewayIntentBits,
    Collection,
    ChannelType,
    TextChannel
} from 'discord.js';

import { token } from './config.json';
import fs from 'fs';
import path from 'path';
import { GameManager } from "./core/GameManager";
import { gameManager } from "./core/gameManagerInstance";

dotenv.config();

/* Extend Client type */
declare module 'discord.js' {
    interface Client {
        commands: Collection<string, any>;
        gameManager: GameManager;
    }
}

/* Create client */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ],
});

/* Attach global instances */
client.commands = new Collection();
client.gameManager = gameManager;

const commandsPath = path.join(__dirname, 'bot/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const command = require(`./bot/commands/${file}`);

    // support CommonJS + ESM default export
    const cmd = command.default ?? command;

    if (!cmd.data || !cmd.execute) {
        console.error(`❌ Commande invalide: ${file}`);
        continue;
    }

    client.commands.set(cmd.data.name, cmd);
}

client.once(Events.ClientReady, (readyClient: Client<true>) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command || typeof command.execute !== 'function') return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred) return;

        await interaction.reply({
            content: "Erreur lors de l'exécution de la commande.",
            ephemeral: true
        });
    }
});

client.on(Events.GuildMemberRemove, async member => {
    for (const [channelId, game] of gameManager.games) {
        const player = game.players.find(p => p.id === member.id);

        if (player) {
            player.isActive = false;

            const channel = client.channels.cache.get(channelId);

            if (channel && channel.type === ChannelType.GuildText) {
                await (channel as TextChannel).send(
                    `<@${member.id}> a quitté le serveur et est retiré de la partie.`
                );
            }
        }
    }
});

client.login(token);