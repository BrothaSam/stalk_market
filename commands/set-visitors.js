const { improperArguments } = require('../default-responses');
const models = require('../models');

module.exports = {
  name: 'set-visitors',
  description:
    'Sets whether or not you want visitors to your island to buy/sell turnips. Setting to `true` will allow other users to view your prices and username.',
  args: true,
  usage: '<boolean>',
  execute(message, args) {
    const author_id = message.author.id;
    const allow_visitors = args[0];
    if (
      args.length === 1 &&
      (allow_visitors === 'true' || allow_visitors === 'false')
    ) {
      models.user_settings
        .upsert({
          author_id,
          allow_visitors,
        })
        .then(() => {
          return message.reply(
            `your allow visitors option has been set to ${allow_visitors}!`
          );
        })
        .catch((err) => {
          console.error('Error saving allow_visitors: ', err);
          return message.reply(
            "I wasn't able to save your allow visitors option. Please try again later."
          );
        });
    } else {
      return message.reply(improperArguments(this.name, this.usage));
    }
  },
};
