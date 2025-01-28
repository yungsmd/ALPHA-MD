
const { keith } = require('../keizzah/keith');
const axios = require('axios');
const conf = require(__dirname + "/../set");
const { dare, truth, random_question, amount_of_questions } = require('../database/truth-dare.js');
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
      contextInfo: {
        externalAdReply: {
          title: "Daily Dose of Advice",
          body: "Here’s a little nugget of wisdom to brighten your day!",
          thumbnailUrl: conf.URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    }, { quoted: messageQuote });
  } catch (error) {
    console.error("Error fetching advice:", error.message || "An error occurred");
    await replyToUser("Oops, an error occurred while processing your request.");
  }
});

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
      contextInfo: {
        externalAdReply: {
          title: "Trivia Time!",
          body: "Challenge yourself with this fun trivia question!",
          thumbnailUrl: conf.URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    }, { quoted: messageQuote });

    // Send the correct answer after 10 seconds
    setTimeout(async () => {
      await zk.sendMessage(dest, {
        text: `The correct answer is: ${correctAnswer}`,
        contextInfo: {
          externalAdReply: {
            title: "Trivia Answer Revealed",
            body: "Did you get it right? Try another trivia question!",
            thumbnailUrl: conf.URL,
            sourceUrl: conf.GURL,
            mediaType: 1,
            showAdAttribution: true
          }
        }
      }, { quoted: messageQuote });
    }, 10000); // Delay for 10 seconds

  } catch (error) {
    console.error("Error getting trivia:", error.message);
    await zk.sendMessage(dest, {
      text: "Error getting trivia. Please try again later.",
      contextInfo: {
        externalAdReply: {
          title: "Trivia Error",
          body: "There was an error retrieving the trivia question. Please try again.",
          thumbnailUrl: conf.URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    }, { quoted: messageQuote });
  }
});


keith({
  nomCom: "question",
  categorie: "fun",
  reaction: "👄"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  try {
    // Respond with a random question
    await zk.sendMessage(dest, {
      text: random_question(),
      contextInfo: {
        externalAdReply: {
          title: "Random Question",
          body: "Here's a fun random question for you to ponder!",
          thumbnailUrl: conf.URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    }, { quoted: ms });
  } catch (error) {
    console.error("Error while handling 'question' command:", error);
    await repondre("Sorry, something went wrong.");
  }
});

// Command for truth
keith({
  nomCom: "truth",
  categorie: "fun",
  reaction: "👄"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  try {
    // Respond with a truth question
    await zk.sendMessage(dest, {
      text: truth(),
      contextInfo: {
        externalAdReply: {
          title: "Truth Question",
          body: "Here's a truth question to test your honesty!",
          thumbnailUrl: conf.URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    }, { quoted: ms });
  } catch (error) {
    console.error("Error while handling 'truth' command:", error);
    await repondre("Sorry, something went wrong.");
  }
});

// Command for dare
keith({
  nomCom: "dare",
  categorie: "fun",
  reaction: "👄"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  try {
    // Respond with a dare
    await zk.sendMessage(dest, {
      text: dare(),
      contextInfo: {
        externalAdReply: {
          title: "Dare Challenge",
          body: "Here's a dare to challenge your bravery!",
          thumbnailUrl: conf.URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    }, { quoted: ms });
  } catch (error) {
    console.error("Error while handling 'dare' command:", error);
    await repondre("Sorry, something went wrong.");
  }
});

// Command for amount of questions
keith({
  nomCom: "amountquiz",
  categorie: "fun",
  reaction: "👄"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  try {
    // Call amount_of_questions with the desired type, defaulting to 0 (all questions)
    const totalQuestions = amount_of_questions(0);  // Change 0 to 1 or 2 depending on the desired category
    await zk.sendMessage(dest, {
      text: `${totalQuestions}`,
      contextInfo: {
        externalAdReply: {
          title: "Question Count",
          body: "Here's the total number of questions available!",
          thumbnailUrl: conf.URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    }, { quoted: ms });
  } catch (error) {
    console.error("Error while handling 'amountquiz' command:", error);
    await repondre("Sorry, something went wrong.");
  }
});

keith({
  nomCom: "fact",
  reaction: '✌️',
  categorie: "Fun"
}, async (dest, zk, context) => {
  const { repondre: respond, arg, ms } = context;

  try {
    const response = await axios.get("https://nekos.life/api/v2/fact");
    const data = response.data;
    const factMessage = `
┏━━━━ *ALPHA-FACT* ━━━━━◆                     
┃
┃   *◇* ${data.fact} 
┃
┃   *◇* Regards *ALPHA MD*
┃      
 ╭────────────────◆
 │ *_Powered by keithkeizzah._*
 ╰─────────────────◆
    `;

    await zk.sendMessage(dest, {
      text: factMessage,
      contextInfo: {
        externalAdReply: {
          title: "Fun Fact",
          body: "Here's a fun fact to enlighten your day!",
          thumbnailUrl: conf.URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    }, { quoted: ms });
  } catch (error) {
    console.error(error);
    await respond("An error occurred while fetching the fact.");
  }
});

keith({
  nomCom: "quotes",
  reaction: '🗿',
  categorie: "Fun"
}, async (dest, zk, context) => {
  const { repondre: respond, arg, ms } = context;

  try {
    const response = await axios.get("https://favqs.com/api/qotd");
    const data = response.data;
    const quoteMessage = `
┏━━━━━QUOTE━━━━━━◆
┃   *◇* _${data.quote.body}_
┃  
┃   *◇* *AUTHOR:* ${data.quote.author}
┃      
┃    *◇*  *regards ALPHA MD*
┃    
╭────────────────◆
│ *_Powered by keithkeizzah._*
╰─────────────────◆
    `;

    await zk.sendMessage(dest, {
      text: quoteMessage,
      contextInfo: {
        externalAdReply: {
          title: "Daily Quote",
          body: "Here's an inspiring quote to motivate you!",
          thumbnailUrl: conf.URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    }, { quoted: ms });
  } catch (error) {
    console.error(error);
    await respond("An error occurred while fetching the quote.");
  }
});



