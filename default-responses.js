const { prefix } = require('./constants');

exports.improperArguments = function (name, usage) {
  return `you did not provide the proper arguments.\n\nCorrect usage is \`${prefix}${name} ${usage}\`.`;
};
