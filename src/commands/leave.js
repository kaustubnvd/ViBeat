module.exports = {
  name: 'leave',
  description: 'Disconnects from the voice channel',
  execute(message, args, servers) {
    // Gets the voice channel the bot is currently in
    const voiceChannel = message.guild.me.voice.channel;
    if (voiceChannel) {
      const { dispatcher, queue } = servers[message.guild.id];
      // Clears queue
      queue.length = 0;
      // Stops current song
      dispatcher.end();
      voiceChannel.leave();
      message.channel.send('\u23FB **Successfully disconnected**');
    }
  }
};