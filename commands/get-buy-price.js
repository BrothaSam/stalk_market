const { improperArguments } = require('../default-responses');
const moment = require('moment');
const models = require('../models');
const { bell } = require('../constants.json');

module.exports = {
  name: 'get-buy-price',
  description: 'Gets the most recent purchase price.',
  args: false,
  execute(message, args) {
    models.buy_prices
      .findAll({
        limit: 1,
        order: [['date', 'DESC']],
      })
      .then((res) => {
        const price = res[0].price;
        const date = moment(res[0].date).format('dddd MMMM Do, YYYY');
        return message.reply(
          `your most recent purchase price is \`${price}\` ${bell} on \`${date}\`!`
        );
      })
      .catch((err) => {
        console.error('Error retrieving buy price: ', err);
        return message.reply(
          "I wasn't able to get your buy price. Please try again later."
        );
      });
  },
};
