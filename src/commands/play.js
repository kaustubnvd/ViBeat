const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
  name: 'play',
  description: 'Plays Music',
  execute(message, args, servers) {
    if (!args.length) {
      message.reply('You didn\'t enter any arguments');
      return;
    }
    const vc = message.member.voice.channel;
    if (!vc) {
      message.reply('**You must be in a voice channel to use this command.**');
      return;
    }
    const serverId = message.guild.id;
    if (!servers[serverId]) {
      servers[serverId] = {
        queue: [],
        isPlaying: false,
        connection: null,
        nowPlaying: '',
      };
    }
    const server = servers[serverId];
    vc.join().then((connection) => {
      server.connection = connection;  // UDP socket connection
      playMusic(server, message, args);
    });
  },
};

async function playMusic(server, message, args) {

  const searchQuery = args.join(' ');
  const videoInfo = await getVideoInfo(searchQuery);
  const URL = videoInfo.url;

  if (server.isPlaying) {
    const { songTitle, messageAuthor, messageAuthorAvatar, videoId, duration } = await getEmbedInfo(URL, message);
    const LIGHT_PINK = '#ca3782';
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const queueEmbed = new Discord.MessageEmbed()
      .setColor(LIGHT_PINK)
      .setTitle(songTitle)
      .setURL(URL)
      .setAuthor(`Added to queue by ${messageAuthor}`, messageAuthorAvatar)
      .setThumbnail(thumbnailUrl)
      .addField('Song Duration', duration);
    message.channel.send(queueEmbed);
    server.queue.push({ message, args, songTitle });
    return;
  }

  message.channel.send(`\u{1F3B6} **Now Playing** \`${videoInfo.title}\``); 
  server.nowPlaying = videoInfo.title;
  
  // Play the music by sending opus packets as a stream from YouTube
  // Returns a dispatcher, which is a writable stream that takes opus audio
  server.dispatcher = server.connection.play(ytdl(URL, {filter: 'audioonly'}), {seek: 0, volume: 1});
  server.isPlaying = true;

  server.dispatcher.on('finish', () => {
    server.isPlaying = false;
    server.nowPlaying = '';
    if (server.queue.length > 0) {
      const { message, args } = server.queue.shift();
      playMusic(server, message, args);
    } 
  });
  
}

async function getVideoInfo(query) {
  const videoResults = await ytSearch(query);
  return videoResults.videos.length > 1 ? videoResults.videos[0] : null; // First video result
}

async function getEmbedInfo(url, message) {
  // Get the song title and duration in seconds
  const yolo = await ytdl.getInfo(url);
  const { title: songTitle, lengthSeconds } = yolo.videoDetails;
  // Get the name and avatar of the person that entered the command
  const messageAuthor = message.author.username;
  const messageAuthorAvatar = message.author.avatarURL();
  // Retrieve the videoId to construct the thumbnail URL
  const videoId = getVideoIdFromUrl(url);
  // Format the duration into minutes:seconds format
  const duration = formatTime(lengthSeconds);
  // Return all the info necessary to create the embed
  return { songTitle, messageAuthor, messageAuthorAvatar, videoId, duration };
}

// Helper function to convert from 'seconds' to 'minutes:seconds'
function formatTime(length_seconds) {
  const SECONDS_PER_MIN = 60;
  const CUTOFF = 10;
  const minutes = Math.floor(length_seconds / SECONDS_PER_MIN);
  const rawSeconds = length_seconds % SECONDS_PER_MIN;
  // Edge case: Need to add a leading zero if the raw seconds is less than 10 
  const seconds = rawSeconds >= CUTOFF ? rawSeconds : `0${rawSeconds}`;
  const duration = `${minutes}:${seconds}`;
  return duration;
}

// Helper function to extract the video id from the full URL
function getVideoIdFromUrl(url) {
  const VIDEO_PARAM = 'v=';
  const videoIdStartIndex = url.indexOf(VIDEO_PARAM) + VIDEO_PARAM.length;
  const videoId = url.slice(videoIdStartIndex);
  return videoId;
}
