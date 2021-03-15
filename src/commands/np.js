module.exports = {
  name: 'np',
  description: 'Now Playing',
  execute(message, args, servers) {
    const { nowPlaying } = servers[message.guild.id];
    if (!nowPlaying) {
      return message.reply('There is no music playing');
    }
    message.channel.send(`\u{1F3B6} **Playing** \`${nowPlaying}\``);
  }
};