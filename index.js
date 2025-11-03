
const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.BOT_TOKEN; 
const PREFIX = ''; 
const COMMAND = 'gen';
const STOP_COMMAND = 'stop';

if (!TOKEN) {
  console.error('Please set BOT_TOKEN in .env');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, 
  ],
  partials: [Partials.Channel],
  allowedMentions: { 
    parse: ['everyone', 'users', 'roles'] 
  }
});


const maxMessagesPerRun = 99999999999;         
const cooldownBetweenRuns = 5 * 60 * 50;      
const minIntervalMs = 500;
const maxIntervalMs = 500;  


const guildState = new Map(); 

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function makePlaceholderLink() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  // طول عشوائي بين 16 و 24 حرف (مثل روابط النيترو الحقيقية)
  const codeLength = randomInt(16, 24);
  for (let i = 0; i < codeLength; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));

  return `https://discord.gift/${code}`;
}


async function checkNitroCode(code) {
  try {
    const fetch = (await import('node-fetch')).default;
    const url = `https://discord.com/api/v9/entitlements/gift-codes/${code}`;
