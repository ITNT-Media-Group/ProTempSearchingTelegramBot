import "dotenv/config";
import { Telegraf } from "telegraf";
import axios from "axios";

const bot = new Telegraf(process.env.BOT_TOKEN);
const GG_API = process.env.GG_API;

if (!BOT_TOKEN || !GG_API) {
  console.error("Missing required environment variables: BOT_TOKEN or GG_API");
  process.exit(1);
}

bot.start(async (ctx) => {
  await ctx.reply("Hi, I'm a GPT Bot. Type your prompt");
});

// Text message handler
bot.on("text", async (ctx) => {
  const messageText = ctx.message.text.trim();
  const response = await askGG(messageText);
  await ctx.reply(response);
});


const askGG = async (prompt) => {
  try {
    const response = await axios.get(`${GG_API}=${prompt}`);
    console.log("response", response);
    return response.data.output;
  } catch (error) {
    console.error("Error communicating with OpenAI API:", error);
    return "Sorry, I'm experiencing some issues. Please try again later.";
  }
};



// Start the bot
bot
  .launch()
  .then(() => {
    console.log("Bot is up and running!");
  })
  .catch((err) => {
    console.error("Failed to launch bot:", err);
  });
