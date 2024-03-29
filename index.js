const Discord = require('discord.js');
const fs = require('fs');
const { prefix } = require('./constants');
const { improperArguments } = require('./default-responses');
const moment = require('moment');
const models = require('./models');
require('dotenv').config();

models.sequelize
  .sync({ force: process.env.NODE_ENV === 'development' ? false : false })
  .then(() => {
    const client = new Discord.Client();
    const cooldowns = new Discord.Collection();
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

      const args = message.content
        .slice(prefix.length)
        .toLowerCase()
        .split(/ +/);
      const commandName = args.shift().toLowerCase();

      //if (!client.commands.has(commandName)) return;

      const command =
        client.commands.get(commandName) ||
        client.commands.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
        );

      if (!command) return;

      if (command.args && !args.length) {
        return message.reply(improperArguments(command.name, command.usage));
      }

      if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown || 3) * 1000;

      if (timestamps.has(message.author.id)) {
        const expirationTime =
          timestamps.get(message.author.id) + cooldownAmount;

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
        console.log(message.content);
        if (command.requiresTimezone) {
          models.user_settings
            .findByPk(message.author.id)
            .then((res) => {
              if (res === null) {
                return message.reply(
                  `you must set your timezone before using \`${command.name}\`. Use \`!help set-tz\` to learn more!`
                );
              }
              const timezone = res.dataValues.timezone;
              command.execute(message, args, timezone);
            })
            .catch((err) => {
              console.error(err);
              return message.reply(
                `\`${message.content}\` requires you to have a saved timezone, and I had trouble retrieving that. Please try again later.`
              );
            });
        } else {
          command.execute(message, args);
        }
      } catch (err) {
        console.error(err);
        message.reply(
          `there was an error trying to execute "${message.content}".`
        );
      }
    });

    client.on('shardError', (error) => {
      console.error('A websocket connection encountered an error:', error);
    });

    process.on('unhandledRejection', (error) => {
      console.error('Unhandled promise rejection:', error);
    });

    client.login(process.env.TOKEN);
  })
  .catch((err) => {
    console.error('Failed to start server: ', err);
  });
