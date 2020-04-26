const { prefix } = require('../constants.json');
const { improperArguments } = require('../default-responses');

module.exports = {
  name: 'help',
  description: 'Lists all commands, or details about a specific command.',
  aliases: ['commands'],
  usage: '[command name]',
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      data.push("Here's a list of all my commands:");
      data.push(commands.map((command) => `\`${command.name}\``).join(', '));
      data.push(
        `You can send \`${prefix}help [command name]\` to get info on a specific command!`
      );

      message.channel.send(data, { split: true });
    } else {
      const name = args[0].toLowerCase();
      const command =
        commands.get(name) ||
        commands.find((c) => c.aliases && c.aliases.includes(name));

      if (!command) {
        message.reply(improperArguments(this.name, this.usage));
      } else {
        data.push(`**Name:** ${command.name}`);

        if (command.aliases)
          data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description)
          data.push(`**Description:** ${command.description}`);
        data.push(
          `**Usage:** \`${prefix}${command.name}${
            command.usage ? ` ${command.usage}` : ''
          }\``
        );
        if (command.cooldown)
          data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, { split: true });
      }
    }
  },
};
