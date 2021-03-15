require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const path = require('path');

bot.commands = new Discord.Collection(); 

// Gets an array of the file names of all the commands 
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(fileName => fileName.endsWith('.js'));

commandFiles.forEach(fileName => {
  const command = require(`./commands/${fileName}`);
  bot.commands.set(command.name, command);
});

const servers = {};

bot.once('ready', () => {
  console.log('ViBeat started!');
  bot.user.setActivity('@ViBeat 🎧', { type: 'LISTENING' });
});

const prefix = '!';

bot.on('message', message => {
  // Ensure message comes from a server, has the right prefix, and isn't sent by a bot
  if (!message.guild || !message.content.startsWith(prefix) || message.author.bot)  {
    return;
  }
  // Splitting the message with regex to allow for an arbitrary number of spaces between arguments
  const args = message.content.slice(prefix.length).split(/ +/); 
  const commandName = args.shift().toLowerCase();
  if (!bot.commands.has(commandName)) {
    return;
  }
  const command = bot.commands.get(commandName);
  try {
    command.execute(message, args, servers);
  } catch (err) {
    console.error(err);
    message.reply('There was trouble completing your request');
  }
});

bot.login(process.env.DISCORD_TOKEN); // Token is the password