const { improperArguments } = require('../default-responses');
const moment = require('moment');
const models = require('../models');
const { bell } = require('../constants.json');

module.exports = {
  name: 'save-buy-price',
  description:
    'Saves the price you bought turnips for. If only a price is provided then the date is assumed to be your current date based on your set timezone. Optional date can be given in `YYYY-MM-DD` format.',
  args: true,
  usage: '<price> [date]',
  execute(message, args) {
    const author_id = message.author.id;
    const price = args[0];

    if (args.length === 1 && !isNaN(price)) {
      upsert(author_id, price, message, null);
    } else if (args.length === 2) {
      if (moment(args[1], moment.ISO_8601).isValid()) {
        upsert(author_id, price, message, args[1]);
      } else {
        return message.reply(improperArguments(this.name, this.usage));
      }
    } else {
      return message.reply(improperArguments(this.name, this.usage));
    }
  },
};

function upsert(author_id, price, message, userDefinedDate) {
  models.user_settings.findByPk(author_id).then((res) => {
    if (res === null) {
      return message.reply(
        'you must set your timezone before saving prices. Use `!help set-tz` to learn more!'
      );
    }
    const timezone = res.dataValues.timezone;
    const dateTime = moment
      .tz(userDefinedDate || message.createAt, timezone)
      .format();
    const date = moment.tz(dateTime, timezone).format('YYYY-MM-DD');
    models.buy_prices
      .upsert({
        author_id,
        date,
        price,
      })
      .then(() => {
        return message.reply(
          `your turnip buy price of \`${price}\` ${bell} has been recorded!`
        );
      })
      .catch((err) => {
        console.error('Error saving buy price: ', err);
        return message.reply(
          "I wasn't able to save your buy price. Please try again later."
        );
      });
  });
}
