const { improperArguments } = require('../default-responses');
const moment = require('moment');
const models = require('../models');
const { bell } = require('../constants.json');
const { Op } = require('sequelize');
const AsciiTable = require('ascii-table');

module.exports = {
  name: 'get-sell-price',
  description: 'Gets recorded sell prices of you, and any mentioned users.',
  args: false,
  aliases: ['get-sell-prices'],
  usage: '[mention]',
  requiresTimezone: true,
  execute(message, args, timezone) {
    let users = [];

    const mentions = message.mentions;

    const userMentions = mentions.everyone
      ? message.guild.members.cache.map((user) => user.user)
      : mentions.users;

    userMentions.map((user) => {
      if (message.author.id !== user.id) {
        users.push({ id: user.id, username: user.username });
      }
    });

    users.push({ id: message.author.id, username: message.author.username });

    const createdAt = message.createdAt;
    const startOfWeek = moment
      .tz(createdAt, timezone)
      .startOf('week')
      .add(0, 'day')
      .format('YYYY-MM-DD');

    models.sell_prices
      .findAll({
        order: [['date', 'DESC']],
        where: {
          author_id: {
            [Op.or]: users.map((user) => user.id),
          },
          date: {
            [Op.gte]: startOfWeek,
          },
        },
      })
      .then((res) => {
        if (res.length === 0) {
          return message.reply(
            'there are no recorded prices for you, or any mentioned users.'
          );
        } else {
          let rows = [];
          res.map((entry) => {
            const data = entry.dataValues;
            const price = data.price;
            const date = data.date;
            const period = data.period;
            const user = users.find((user) => user.id === data.author_id)
              .username;
            const expireTime = data.expires;
            const expired = moment().utc().isAfter(expireTime);
            rows.push([price, date, period, user, expired]);
          });

          let table = new AsciiTable().fromJSON({
            title: `Sell Prices`,
            heading: ['Price', 'Date', 'Period', 'User', 'Expired'],
            rows,
          });
          return message.reply(`\n\`${table.toString()}\``);
        }
      })
      .catch((err) => {
        console.error('Error retrieving sell prices: ', err);
        return message.reply(
          "I wasn't able to get your sell prices. Please try again later."
        );
      });
  },
};
