const { keith } = require('../keizzah/keith');
const axios = require('axios');
const conf = require(__dirname + "/../set");

keith({
  nomCom: "advice",
  aliases: ["wisdom", "wise"],
  reaction: "🗨️",
  categorie: "Fun"
}, async (dest, zk, context) => {
  const { reply: replyToUser, ms: messageQuote } = context;
  try {
    // Get advice from the API using axios
    const response = await axios.get("https://api.adviceslip.com/advice");
    const advice = response.data.slip.advice;
    
    // Send the advice with ad reply
    await zk.sendMessage(dest, {
      text: `Here is your advice: ${advice} 😊`,
      externalAdReply: {
        title: "Your Temporary Email Session Has Ended",
        body: "Your temporary email session has expired. Need another one? Just ask!",
        thumbnailUrl: conf.URL,
        sourceUrl: conf.GURL,
        mediaType: 1,
        showAdAttribution: true
      }
    }, { quoted: messageQuote });
  } catch (error) {
    console.error("Error fetching advice:", error.message || "An error occurred");
    await replyToUser("Oops, an error occurred while processing your request.");
  }
});

// Command for generating a trivia question
keith({
  nomCom: "trivia",
  reaction: '🤔',
  categorie: 'Fun'
}, async (dest, zk, context) => {
  const { reply: replyToUser, prefix: prefix, ms: messageQuote } = context;
  try {
    // Fetch trivia question using axios
    const response = await axios.get("https://opentdb.com/api.php?amount=1&type=multiple");
    if (response.status !== 200) {
      return replyToUser("Invalid response from the trivia API. Status code: " + response.status);
    }

    const trivia = response.data.results[0];
    const question = trivia.question;
    const correctAnswer = trivia.correct_answer;
    const answers = [...trivia.incorrect_answers, correctAnswer].sort();

    // Format answer choices
    const answerChoices = answers.map((answer, index) => `${index + 1}. ${answer}`).join("\n");

    // Send trivia question with answer choices
    await zk.sendMessage(dest, {
      text: `Here's a trivia question for you: \n\n${question}\n\n${answerChoices}\n\nI will send the correct answer in 10 seconds...`,
      externalAdReply: {
        title: "Your Temporary Email Session Has Ended",
        body: "Your temporary email session has expired. Need another one? Just ask!",
        thumbnailUrl: conf.URL,
        sourceUrl: conf.GURL,
        mediaType: 1,
        showAdAttribution: true
      }
    }, { quoted: messageQuote });

    // Send the correct answer after 10 seconds
    setTimeout(async () => {
      await zk.sendMessage(dest, {
        text: `The correct answer is: ${correctAnswer}`,
        externalAdReply: {
          title: "Your Temporary Email Session Has Ended",
          body: "Your temporary email session has expired. Need another one? Just ask!",
          thumbnailUrl: conf.URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true
        }
      }, { quoted: messageQuote });
    }, 10000); // Delay for 10 seconds

  } catch (error) {
    console.error("Error getting trivia:", error.message);
    await zk.sendMessage(dest, {
      text: "Error getting trivia. Please try again later.",
      externalAdReply: {
        title: "Your Temporary Email Session Has Ended",
        body: "Your temporary email session has expired. Need another one? Just ask!",
        thumbnailUrl: conf.URL,
        sourceUrl: conf.GURL,
        mediaType: 1,
        showAdAttribution: true
      }
    }, { quoted: messageQuote });
  }
});
