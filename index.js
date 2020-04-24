const Discord = require('discord.js');
const fs = require('fs');
const { prefix } = require('./config.json');
require('dotenv').config();

const client = new Discord.Client();

client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).toLowerCase().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  console.log(message.content);

  if (command.args && !args.length) {
    return message.reply(
      `you didn't provide any of the required arguments!\nCorrect usage is "${prefix}${command.name} ${command.usage}".`
    );
  }

  try {
    command.execute(message, args);
  } catch (err) {
    console.error(err);
    message.reply(`There was an error trying to execute "${message.content}"`);
  }
});

client.login(process.env.TOKEN);
