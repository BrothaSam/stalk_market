const { period } = require('../constants.json');
const { improperArguments } = require('../default-responses');
const moment = require('moment');
const models = require('../models');

module.exports = {
  name: 'save-price',
  description:
    'Saves the price of a single turnip to the database. User can provide optional date and period.',
  args: true,
  usage: '<price> [<date (ISO format)> <am/pm>]',
  execute(message, args) {
    const authorId = message.author.id;
    const createdDate = moment(message.createdAt).utc().format('YYYY-MM-DD');
    const createdPeriod = moment(message.createdAt).utc().hour() < 12 ? 'am' : 'pm';
    const price = args[0];

    if (args.length === 1 && !isNaN(price)) {
      models.prices
        .create({
          author_id: authorId,
          date: createdDate,
          period: createdPeriod,
          price: price,
        })
        .then(() => {
          message.reply(
            `your turnip price of ${price} bells has been recorded!`
          );
        })
        .catch((err) => {
          if (err.original.errno === 19) {
            console.log(price, createdDate, createdPeriod);
            message.reply(
              `you've already recorded ${price} bells for ${createdDate} ${createdPeriod}!`
            );
          } else {
            console.error('Error inserting price: ', err);
            message.reply(
              "I wasn't able to save your price. Please try again later."
            );
          }
        });
    } else if (args.length === 3) {
      if (
        moment(args[1], moment.ISO_8601).isValid() &&
        period.includes(args[2])
      ) {
        const date = moment(args[1]).format('YYYY-MM-DD');
        const period = args[2];
        message.reply(
          `your turnip price of ${price} bells, for ${date} ${period} has been recorded!`
        );
      } else {
        message.reply(improperArguments(this.name, this.usage));
      }
    } else {
      message.reply(improperArguments(this.name, this.usage));
    }
  },
};
