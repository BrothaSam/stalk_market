const { days, meridiem } = require('../config.json');
const { improperArguments } = require('../default-responses');

module.exports = {
  name: 'save-price',
  description:
    'Saves the price of a single turnip to the database. User can provide optional day and meridiem.',
  args: true,
  usage: '<price> [<day> <am/pm>]',
  execute(message, args) {
    const price = args[0];

    if (args.length === 1 && !isNaN(args[0])) {
      const price = args[0];
      message.reply(`your turnip price of ${price} bells has been recorded!`);
    } else if (args.length === 3) {
      if (days.includes(args[1]) && meridiem.includes(args[2])) {
        const day = args[1].charAt(0).toUpperCase() + args[1].slice(1);
        const meridiem = args[2].toUpperCase();
        message.reply(
          `your turnip price of ${price} bells, for ${day} ${meridiem} has been recorded!`
        );
      } else {
        message.reply(improperArguments(this.name, this.usage));
      }
    } else {
      message.reply(improperArguments(this.name, this.usage));
    }
  },
};
