const { improperArguments } = require('../default-responses');
const { Op } = require('sequelize');
const moment = require('moment');
const models = require('../models');
const { bell } = require('../constants.json');
const AsciiTable = require('ascii-table');

module.exports = {
  name: 'get-buy-price',
  description:
    'Gets the most recent purchase price of you, and any mentioned users. Use `@here` or `@everyone` mentions to fetch for enitre guild.',
  args: false,
  usage: '[mention]',
  execute(message, args) {
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

    models.buy_prices
      .findAll({
        order: [['price', 'DESC']],
        where: {
          author_id: {
            [Op.or]: users.map((user) => user.id),
          },
        },
      })
      .then((res) => {
        if (res.length === 0) {
          return message.reply(
            'there are no recorded prices for you, or any mentioned users.'
          );
        }
        let rows = [];
        res.map((data) => {
          const values = data.dataValues;
          const price = values.price;
          const user = users.find((user) => user.id === values.author_id)
            .username;
          const date = values.date;
          rows.push([price, user, date]);
        });
        let table = new AsciiTable().fromJSON({
          title: `Buy Prices`,
          heading: ['Price', 'User', 'Date'],
          rows,
        });

        return message.reply(`\n\`${table.toString()}\``);
      })
      .catch((err) => {
        console.error('Error retrieving buy price: ', err);
      });
  },
};
