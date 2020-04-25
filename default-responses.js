const { prefix } = require('./constants');

exports.improperArguments = function (name, usage, additional) {
  return `you did not provide the proper arguments.\nCorrect usage is \`${prefix}${name} ${usage}\`. ${
    additional ? "\n" + additional : ''
  }`;
};
