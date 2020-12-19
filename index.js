const { Plugin } = require('powercord/entities');
const DISCORD_EPOCH = Number(1420070400000);

module.exports = class SnowflakeInfo extends Plugin {
  startPlugin () {
    const idToBinary = async(num) => {
      let bin = '';
      let high = parseInt(num.slice(0, -10)) || 0;
      let low = parseInt(num.slice(-10));
      while (low > 0 || high > 0) {
        bin = String(low & 1) + bin;
        low = Math.floor(low / 2);
        if (high > 0) {
          low += 5000000000 * (high % 2);
          high = Math.floor(high / 2);
        }
      }
      return bin;
    }

    powercord.api.commands.registerCommand({
      command: 'snowflake',
      aliases: [],
      description: 'Lets you see the creation date of a snowflake.',
      usage: '{c} <snowflake>', 
	  executor: async (args) => {
        if(args.length < 1) {
          return {
            send: false,
            result: 'Please provide a snowflake to check'
          };
        }

        if(!/\d{1,20}/.test(args[0])) return {
          send: false,
          result: 'The provided argument is not a snowflake'
        };

        const BINARY = (await idToBinary(args[0])).toString(2).padStart(64, '0');

        const res = {
          timestamp: parseInt(BINARY.substring(0, 42), 2) + DISCORD_EPOCH,
          workerID: parseInt(BINARY.substring(42, 47), 2),
          processID: parseInt(BINARY.substring(47, 52), 2),
          increment: parseInt(BINARY.substring(52, 64), 2),
          binary: BINARY,
        };

        return {
          send: false,
          result: `Snowflake info for \`${args[0]}\`\n\n`
                + `**Timestamp**: ${new Date(res.timestamp).toUTCString()} (${res.timestamp})\n`
                + `**Worker ID**: ${res.workerID}\n`
                + `**Process ID**: ${res.processID}\n`
                + `**Increment**: ${res.increment}\n`
                + `**Binary**: ${res.binary}\n`

        };
      }
    })
  }
  	pluginWillUnload () {
	  powercord.api.commands.unregisterCommand('snowflake')
	}
}
