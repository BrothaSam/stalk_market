const { improperArguments } = require('../default-responses');
const moment = require('moment');
const models = require('../models');
const { bell } = require('../constants.json');
const { Op } = require('sequelize');
const AsciiTable = require('ascii-table');

module.exports = {
  name: 'get-sell-price',
  description: 'Gets all recorded sell prices for the week.',
  args: false,
  execute(message, args) {
    const author_id = message.author.id;
    const createdAt = message.createdAt;
    models.user_settings.findByPk(author_id).then((res) => {
      console.log(res);
      if (res === null) {
        return message.reply(
          'you must set your timezone before getting prices. Use `!help set-tz` to learn more!'
        );
      }
      const timezone = res.dataValues.timezone;
      const startOfWeek = moment
        .tz(createdAt, timezone)
        .startOf('week')
        .add(1, 'day')
        .format('YYYY-MM-DD');

      models.sell_prices
        .findAll({
          order: [['date', 'DESC']],
          where: {
            author_id,
            date: {
              [Op.gte]: startOfWeek,
            },
          },
        })
        .then((res) => {
          console.log(res.length);
          if (res.length === 0) {
            return message.reply(
              'you have no recorded sell prices for this week.'
            );
          } else {
            let rows = [];
            res.map((entry) => {
              rows.push([entry.date, entry.period, entry.price]);
            });

            let table = new AsciiTable().fromJSON({
              title: `Prices`,
              heading: ['Date', 'Period', 'Price'],
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
    });
  },
};
