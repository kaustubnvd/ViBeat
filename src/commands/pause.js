module.exports = {
  name: 'pause',
  description: 'Pauses the music currently playing',
  execute(message, args, servers) {
    const { dispatcher }  = servers[message.guild.id];
    if (dispatcher) {
      dispatcher.pause();
      message.channel.send('\u23F8 **Music has been paused**');
    }
  }
};