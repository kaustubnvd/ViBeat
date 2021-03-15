module.exports = {
  name: 'clear',
  description: 'Clears the music queue',
  execute(message, args, servers) {
    // Import music queue from play.js
    const { queue } = servers[message.guild.id];
    if (!queue.length) {
      return message.reply('The music queue is empty');
    }
    // Clears queue
    queue.length = 0;
    message.channel.send('\u{1F4A5} **Cleared music queue**');
  }
};