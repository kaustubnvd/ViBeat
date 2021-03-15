module.exports = {
  name: 'resume',
  description: 'Resumes music playback if paused',
  execute(message, args, servers) {
    const { dispatcher } = servers[message.guild.id];
    if (dispatcher) {
      dispatcher.resume();
      message.channel.send('\u23EF **Resumed music playback**');
    }
  }
};