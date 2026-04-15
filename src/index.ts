import dotenv from 'dotenv';
import { Client, Events, GatewayIntentBits, Collection } from 'discord.js';
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
  intents: [GatewayIntentBits.Guilds],
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

client.login(token);