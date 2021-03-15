module.exports = {
  name: 'queue',
  description: 'Displays the music queue',
  execute(message, args, servers) {
    const { queue } = servers[message.guild.id];
    if (!queue.length) {
      return message.reply('The music queue is empty');
    }
    const displayQueue = formatQueueData(queue);
    message.channel.send(displayQueue);
  }
};

function formatQueueData(queue) {
  let formattedQueue = '```\nMusic Queue:\n\n';
  queue.forEach((song, index) => {
    const queuePosition = index + 1;
    formattedQueue += `${queuePosition}. ${song.songTitle}\n`;
  });
  formattedQueue += '```';
  return formattedQueue;
}