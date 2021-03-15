module.exports = {
  name: 'skip',
  description: 'Skips the currently playing song',
  execute(message, args, servers) {
    const { dispatcher } = servers[message.guild.id];
    if (dispatcher) {
      dispatcher.end();
      message.channel.send('\u23ED **Skipped current song**');
    }
  }
};