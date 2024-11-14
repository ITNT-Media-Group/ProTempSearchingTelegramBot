import "dotenv/config";
import { Telegraf } from "telegraf";
import axios from "axios";
import { response } from "express";

const bot = new Telegraf(process.env.BOT_TOKEN);
const GG_API = process.env.GG_API;

if (!process.env.BOT_TOKEN || !GG_API) {
  console.error("Missing required environment variables: BOT_TOKEN or GG_API");
  process.exit(1);
}

const chatHistory = [];

const criteriaPrompt = `
      From the following conversation, extract the most important job search criteria:
      ${chatHistory.join("\n")}

      Focus on these details:
      - Job Title
      - Location
      - Salary Expectations
      - Job Type
      - Industry
      - Required Skills

      Return the extracted criteria in a JSON format like this:
      {
        "title": "Software Developer",
        "location": "New York",
        "salary": "100k",
        "type": "full-time",
        "industry": "tech",
        "skills": ["JavaScript", "Python"]
      }

      Aus der folgenden Konversation die wichtigsten Job-Suchkriterien extrahieren:
      ${chatHistory.join("\n")}

      Konzentriere Dich auf diese Details:
      - Branche: (Handwerk, Industrie, Dienstleistung oder Handel) 
      - Jobtitel
      - Standort (z.B. Berlin, München, Hamburg) 
      - Gehaltserwartungen (z.B. 40.000 € pro Jahr)
      - Jobart (z.B. Vollzeit, Teilzeit, Freelance) 
      - Erforderliche Fähigkeiten

      Die extrahierten Kriterien im JSON-Format wie folgt zurückgeben:
      {
        "title": "Softwareentwickler",
        "location": "New York",
        "salary": "100k",
        "type": "Vollzeit",
        "industry": "tech",
        "skills": ["JavaScript", "Python"]
      }
    `;

const getInfoMessage = () => {
  return (
    "Konzentriere Dich auf diese Details:\n \n" +
    "- Branche: (Handwerk, Industrie, Dienstleistung oder Handel) \n" +
    "- Jobtitel \n" +
    "- Standort (z.B. Berlin, München, Hamburg) \n" +
    "- Gehaltserwartungen (z.B. 40.000 € pro Jahr) \n" +
    "- Jobart (z.B. Vollzeit, Teilzeit, Freelance) \n" +
    "- Erforderliche Fähigkeiten (z.B. Programmiersprachen, Softwarekenntnisse) \n" +
    "- Beispiel: Ich suche einen Job als Softwareentwickler in Berlin mit einem Gehalt von 50.000 € pro Jahr. \n" +
    "- Beispiel: Ich möchte eine Teilzeitstelle als Grafikdesigner in München finden. \n" +
    "- Beispiel: Ich brauche einen Freelance-Job als Übersetzer mit Kenntnissen in Englisch und Spanisch. \n"
  );
};

const compare = (prompt) => {
  const ufiedPrompt = prompt.join;
  const response = askGG(prompt);
};

bot.start(async (ctx) => {
  await ctx.reply("Hallo, ich bin ProTemp Bot und helfe dir bei deiner Jobsuche!");

  setTimeout(() => ctx.reply(getInfoMessage()), 300);
  const crtiteriaResponse = await askGG(criteriaPrompt);
//   console.log("response: ", crtiteriaResponse);
});

// Text message handler
bot.on("message", async (ctx) => {
  // prompt to extract key job criteria

  try {
    const messageText = ctx.message.text.trim();
    chatHistory.push(messageText);
    // chatHistory.push(crtiteriaResponse);

    const promptWithHistory = chatHistory.join("\n");
    const response = await askGG(promptWithHistory);
    await ctx.reply(response);
  } catch (error) {
    console.error("Error extracting job criteria:", error);
    await ctx.reply("Sorry, I'm having trouble processing your request.");
  }
});

const askGG = async (prompt) => {
  try {
    const encPrompt = encodeURIComponent(prompt);
    console.log(prompt);
    const response = await axios.get(`${GG_API}=${encPrompt}`);
    // const response = await axios(GG_API);

    // console.log("response", response);
    return response.data.output;
  } catch (error) {
    console.error("Error communicating with GG API:", error);
    return "Sorry, I'm experiencing some issues. Please try again later.";
  }
};

// search job in the db
const searchJob = () => {
  return;
  //example`
  // {
  //     title: "Software Developer",
  //     company: "Tech Innovations Inc.",
  //     location: "Remote",
  //     salary: "$120,000",
  //     type: "Full-time"
  //   }
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
