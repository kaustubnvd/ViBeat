module.exports = {
  name: 'stop',
  description: 'Stops all the music',
  execute(message, args, servers) {
    const { dispatcher, queue } = servers[message.guild.id];
    if (dispatcher) {
      // Clears queue
      queue.length = 0;
      // Stops current song
      dispatcher.end();
      message.channel.send('\u23F9 **Stopped all songs**');
    }
  }
};