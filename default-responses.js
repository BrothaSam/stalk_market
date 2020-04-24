const { prefix } = require('./config.json');

exports.improperArguments = function (name, usage) {
  return `you did not provide the proper arguments.\n\nCorrect usage is \`${prefix}${name} ${usage}\`.`;
};
