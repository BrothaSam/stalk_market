const { periods, bell, expireTimes } = require('../constants.json');
const { improperArguments } = require('../default-responses');
const moment = require('moment');
const models = require('../models');

module.exports = {
  name: 'save-sell-price',
  description:
    'Saves the sell price offered on your island for a given day and period. If only a price is provided then the date and period is assumed to be current time based on your set timezone. Optional date `YYYY-MM-DD` and period `am/pm` can be provided by the user.',
  args: true,
  aliases: ['set-sell-price'],
  requiresTimezone: true,
  usage: '<price> [<date> <period>]',
  execute(message, args, timezone) {
    const author_id = message.author.id;
    const price = args[0];

    if (args.length === 1 && !isNaN(price)) {
      upsert(author_id, price, message, timezone, null, null);
    } else if (args.length === 3) {
      if (
        moment(args[1], moment.ISO_8601).isValid() &&
        periods.includes(args[2])
      ) {
        upsert(author_id, price, message, timezone, args[1], args[2]);
      } else {
        return message.reply(improperArguments(this.name, this.usage));
      }
    } else {
      return message.reply(improperArguments(this.name, this.usage));
    }
  },
};

function upsert(
  author_id,
  price,
  message,
  timezone,
  userDefinedDate,
  userDefinedPeriod
) {
  const dateTime = moment
    .tz(userDefinedDate || message.createAt, timezone)
    .format();
  const period =
    userDefinedPeriod || moment.tz(dateTime, timezone).hour() < 12
      ? 'am'
      : 'pm';
  const date = moment.tz(dateTime, timezone).format('YYYY-MM-DD');
  const expires = moment
    .tz(`${date}${expireTimes[period]}`, timezone)
    .utc()
    .format();
  console.log(expires);
  models.sell_prices
    .upsert({
      author_id,
      date,
      period,
      price,
      expires,
    })
    .then(() => {
      return message.reply(
        `your turnip sell price of \`${price}\` ${bell} has been recorded!`
      );
    })
    .catch((err) => {
      console.error('Error inserting sell price: ', err);
      return message.reply(
        "I wasn't able to save your sell price. Please try again later."
      );
    });
}
