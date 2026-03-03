import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import config from './config.json';

const { token, clientId, guildId } = config;

const commands: any[] = [];

const commandsPath = path.join(__dirname, 'bot/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const command = require(`./bot/commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

async function deploy() {
    try {
        console.log("Déploiement des commandes...");

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );

        console.log("Commandes déployées !");
    } catch (err) {
        console.error(err);
    }
}

deploy();