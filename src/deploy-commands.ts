import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import { token } from './config.json';
import fs from 'fs';
import path from 'path';

const commands: any[] = [];

// Charger toutes les commandes
const commandsPath = path.join(__dirname, 'bot/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const command = require(`./bot/commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

async function deployCommands() {
    try {
        console.log('Déploiement des commandes...');

        await rest.put(
            Routes.applicationCommands(require('./config.json').clientId),
            { body: commands }
        );

        console.log('Commandes déployées !');
    } catch (error) {
        console.error(error);
    }
}

deployCommands();