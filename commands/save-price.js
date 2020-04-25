const { period } = require('../constants.json');
const { improperArguments } = require('../default-responses');
const moment = require('moment');
module.exports = {
  name: 'save-price',
  description:
    'Saves the price of a single turnip to the database. User can provide optional date and period.',
  args: true,
  usage: '<price> [<date (ISO format)> <am/pm>]',
  execute(message, args) {
    const price = args[0];

    if (args.length === 1 && !isNaN(args[0])) {
      const price = args[0];
      message.reply(`your turnip price of ${price} bells has been recorded!`);
    } else if (args.length === 3) {
      if (moment(args[1], moment.ISO_8601).isValid() && period.includes(args[2])) {
        const date = moment(args[1]).format('YYYY-MM-DD')
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
