
const { keith } = require("../keizzah/keith");
const ai = require('unlimited-ai');

keith({
  nomCom: "gpt",
  aliases: ["gpt4", "ai"],
  reaction: '⚔️',
  categorie: "search"
}, async (dest, zk, params) => {
  const { repondre, arg } = params;  // Use args for the command arguments
  const alpha = arg.join(" ").trim(); // Assuming args is an array of command parts

  if (!alpha) {
    return repondre("Please provide a song name.");
  }

  // Assuming 'alpha' is the text we want to use in the AI prompt
  const text = alpha;  // Set the text that will be passed to the AI

  try {
    const model = 'gpt-4-turbo-2024-04-09'; 

    const messages = [
      { role: 'user', content: text },
      { role: 'system', content: 'You are an assistant in WhatsApp. You are called Keith. You respond to user commands.' }
    ];

    const response = await ai.generate(model, messages);
    await zk.sendMessage(dest, {
      text: response,
      contextInfo: {
        externalAdReply: {
          title: "ALPHA-MD GPT4",
          body: "keep learning", // Format the uptime before sending
          thumbnailUrl: "https://files.catbox.moe/palnd8.jpg", // Replace with your bot profile photo URL
          sourceUrl: "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47", // Your channel URL
          mediaType: 1,
          showAdAttribution: true, // Verified badge
        },
      },
    });

  } catch (error) {
    console.error("Error generating AI response:", error);
    await repondre("Sorry, I couldn't process your request.");
  }
});

keith({
  nomCom: "gemini",
  aliases: ["gpto4", "gemni", "gpt2", "gpt3"],
  reaction: '⚔️',
  categorie: "search"
}, async (context, zk, params) => {
  const { repondre, arg } = params;
  const elementQuery = arg.join(" ").trim(); // Use 'arg' to capture the user query

  // Check if elementQuery is empty
  if (!elementQuery) {
    return repondre("Please provide a song name.");
  }

  try {
    // Dynamically import Gemini AI
    const { default: Gemini } = await import('gemini-ai');
    const gemini = new Gemini("AIzaSyC3sNClbdraGrS2ubb5PTdnm_RbUANtdzc");

    const chat = gemini.createChat();

    // Ask Gemini AI for a response
    const res = await chat.ask(elementQuery);

    await zk.sendMessage(context, {
      text: res,
      contextInfo: {
        externalAdReply: {
          title: "ALPHA-MD GEMINI",
          body: "keep learning", // Format the uptime before sending
          thumbnailUrl: "https://files.catbox.moe/palnd8.jpg", // Replace with your bot profile photo URL
          sourceUrl: "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47", // Your channel URL
          mediaType: 1,
          showAdAttribution: true, // Verified badge
        },
      },
    });

  } catch (e) {
    // Handle errors by sending a message to the user
    await repondre("I am unable to generate responses\n\n" + e.message);
  }
});
 
