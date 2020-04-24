const Discord = require('discord.js');
const fs = require('fs');
const { prefix } = require('./config.json');
require('dotenv').config();

const client = new Discord.Client();

client.commands = new Discord.Collection();

const cooldowns = new Discord.Collection();

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

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  console.log(message.content);

  if (command.args && !args.length) {
    return message.reply(
      `you didn't provide any of the required arguments!\nCorrect usage is "${prefix}${command.name} ${command.usage}".`
    );
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (err) {
    console.error(err);
    message.reply(`There was an error trying to execute "${message.content}"`);
  }
});

client.on('shardError', (error) => {
  console.error('A websocket connection encountered an error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

client.login(process.env.TOKEN);
