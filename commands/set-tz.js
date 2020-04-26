const { improperArguments } = require('../default-responses');
const moment = require('moment');
const models = require('../models');

module.exports = {
  name: 'set-tz',
  description:
    'Sets your timezone. To find your timezone go to http://kevalbhatt.github.io/timezone-picker/',
  args: true,
  usage: '<timezone>',
  execute(message, args) {
    let lowerCaseTimezones = [];

    moment.tz
      .names()
      .map((name) => lowerCaseTimezones.push(name.toLowerCase()));

    if (args.length === 1 && lowerCaseTimezones.includes(args[0])) {
      const author_id = message.author.id;
      const index = lowerCaseTimezones.indexOf(args[0]);
      const timezone = moment.tz.names()[index];

      models.user_settings
        .upsert({
          author_id,
          timezone,
        })
        .then(() => {
          return message.reply(`your timezone has been set to ${timezone}!`);
        })
        .catch((err) => {
          console.error('Error inserting timezone: ', err);
          return message.reply(
            "I wasn't able to save your timezone. Please try again later."
          );
        });
    } else {
      const addtional =
        'Format should be like "America/Chicago". To find your timezone go to http://kevalbhatt.github.io/timezone-picker/';
      return message.reply(improperArguments(this.name, this.usage, addtional));
    }
  },
};
