const Discord = require('discord.js');
const fs = require('fs');
const { prefix } = require('./constants');
const { improperArguments } = require('./default-responses');
const moment = require('moment');
const models = require('./models');
require('dotenv').config();

const tempSell = [
  { date: '2020-04-19', period: 'am', price: 1 },
  { date: '2020-04-18', period: 'pm', price: 2 },
  { date: '2020-04-20', period: 'am', price: 123 },
  { date: '2020-04-20', period: 'pm', price: 124 },
  { date: '2020-04-21', period: 'am', price: 125 },
  { date: '2020-04-21', period: 'pm', price: 126 },
  { date: '2020-04-22', period: 'am', price: 127 },
  { date: '2020-04-22', period: 'pm', price: 128 },
  { date: '2020-04-23', period: 'am', price: 129 },
  { date: '2020-04-23', period: 'pm', price: 130 },
  { date: '2020-04-24', period: 'am', price: 131 },
  { date: '2020-04-24', period: 'pm', price: 132 },
  { date: '2020-04-25', period: 'am', price: 133 },
  { date: '2020-04-25', period: 'pm', price: 800 },
];

models.sequelize
  .sync({ force: true })
  .then(() => {
    //DEV ONLY
/*     models.user_settings
      .upsert({
        author_id: '551924397347176550',
        timezone: 'America/Chicago',
      })
      .then(() => {
        tempSell.map((sell) => {
          models.sell_prices.upsert({
            author_id: '551924397347176550',
            date: sell.date,
            period: sell.period,
            price: sell.price,
          });
        });
      }); */
    //DEV ONLY ABOVE

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

      const args = message.content
        .slice(prefix.length)
        .toLowerCase()
        .split(/ +/);
      const commandName = args.shift().toLowerCase();

      if (!client.commands.has(commandName)) return;

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
        command.execute(message, args);
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

    client.login(process.env.TOKEN);
  })
  .catch((err) => {
    console.error('Failed to start server: ', err);
  });

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});
