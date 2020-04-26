const { improperArguments } = require('../default-responses');
const moment = require('moment');
const models = require('../models');
const AsciiTable = require('ascii-table');

module.exports = {
  name: 'get-settings',
  description: 'Gets settings of user who initiated command.',
  args: false,
  execute(message, args) {
    models.user_settings
      .findAll({
        limit: 1,
        where: {
          author_id: message.author.id,
        },
      })
      .then((res) => {
        if (res.length === 0) {
          return message.reply(
            "you don't have any settings yet! Use `!help` to find commands that will save your settings."
          );
        }
        let table = new AsciiTable().fromJSON({
          title: `Settings`,
          heading: ['Timezone', 'Allow Visitors'],
          rows: [[res[0].timezone, res[0].allow_visitors]],
        });
        return message.reply(`\n\`${table.toString()}\``);
      })
      .catch((err) => {
        console.error('Error retrieving user settings: ', err);
        return message.reply(
          "I wasn't able to get your settings. Please try again later."
        );
      });
  },
};
