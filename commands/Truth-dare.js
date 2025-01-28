const { keith } = require("../keizzah/keith");
const { default: axios } = require("axios");
const { dare, truth, random_question } = require('../database/truth-dare.js');

// Command for random question
keith({
  nomCom: "question",
  categorie: "fun",
  reaction: "👄"
}, async (dest, zk, commandeOptions) => {
  const { repondre } = commandeOptions;
  try {
    // Respond with a random question
    return await repondre(random_question());
  } catch (error) {
    console.error("Error while handling 'question' command:", error);
    return await repondre("Sorry, something went wrong.");
  }
});

// Command for truth
keith({
  nomCom: "truth",
  categorie: "fun",
  reaction: "👄"
}, async (dest, zk, commandeOptions) => {
  const { repondre } = commandeOptions;
  try {
    // Respond with a truth question
    return await repondre(truth());
  } catch (error) {
    console.error("Error while handling 'truth' command:", error);
    return await repondre("Sorry, something went wrong.");
  }
});

// Command for dare
keith({
  nomCom: "dare",
  categorie: "fun",
  reaction: "👄"
}, async (dest, zk, commandeOptions) => {
  const { repondre } = commandeOptions;
  try {
    // Respond with a dare
    return await repondre(dare());
  } catch (error) {
    console.error("Error while handling 'dare' command:", error);
    return await repondre("Sorry, something went wrong.");
  }
});
