
const { keith } = require('../keizzah/keith');
const axios = require('axios');
const conf = require(__dirname + "/../set");

keith({
  nomCom: "technews",
  reaction: '📰',
  categorie: 'search'
}, async (dest, zk, context) => {
  const { repondre, ms } = context;

  try {
    // Fetching tech news from the API
    const response = await axios.get("https://fantox001-scrappy-api.vercel.app/technews/random");
    const data = response.data;
    const { thumbnail, news } = data;

    await zk.sendMessage(dest, {
      text: news,
      contextInfo: {
        externalAdReply: {
          title: "ALPHA-MD TECH NEWS",
          body: "keep learning", 
          thumbnailUrl: thumbnail, 
          sourceUrl: conf.GURL, 
          mediaType: 1,
          showAdAttribution: true, 
        },
      },
    }, { quoted: ms });

  } catch (error) {
    console.error("Error fetching tech news:", error);
    await repondre("Sorry, there was an error retrieving the news. Please try again later.\n" + error);
  }
});


keith({
  nomCom: "bible",
  reaction: '🎎',
  categorie: "search"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const reference = arg.join(" ");
  
  if (!reference) {
    return repondre("Please specify the book, chapter, and verse you want to read. Example: bible john 3:16", {
      contextInfo: {
        externalAdReply: {
          title: "Bible Reference Required",
          body: "Please provide a book, chapter, and verse.",
          thumbnailUrl: "https://files.catbox.moe/zt9ie6.jpg", // Replace with a suitable thumbnail URL
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true,
        },
      },
    });
  }
  
  try {
    const response = await axios.get(`https://bible-api.com/${reference}`);
    
    if (!response.data) {
      return repondre("Invalid reference. Example: bible john 3:16", {
        contextInfo: {
          externalAdReply: {
            title: "Invalid Bible Reference",
            body: "Please provide a valid book, chapter, and verse.",
            thumbnailUrl: "https://files.catbox.moe/zt9ie6.jpg", // Replace with a suitable thumbnail URL
            sourceUrl: conf.GURL,
            mediaType: 1,
            showAdAttribution: true,
          },
        },
      });
    }
    
    const data = response.data;
    const messageText = `
ᬑ *ALPHA HOLY BIBLE* ᬒ

⧭ *_WE'RE READING:_* ${data.reference}

⧭ *_NUMBER OF VERSES:_* ${data.verses.length}

⧭ *_NOW READ:_* ${data.text}

⧭ *_LANGUAGE:_* ${data.translation_name}
╭────────────────◆
│ *_Powered by ${conf.OWNER_NAME}*
╰─────────────────◆ `;
    
    await zk.sendMessage(dest, {
      text: messageText,
      contextInfo: {
        externalAdReply: {
          title: "ALPHA-MD HOLY BIBLE",
          body: `We're reading: ${data.reference}`,
          mediaType: 1,
          thumbnailUrl: "https://files.catbox.moe/zt9ie6.jpg", 
          sourceUrl: conf.GURL,
          showAdAttribution: true, 
        },
      },
    }, { quoted: ms });
    
  } catch (error) {
    console.error("Error fetching Bible passage:", error);
    await repondre("An error occurred while fetching the Bible passage. Please try again later.", {
      contextInfo: {
        externalAdReply: {
          title: "Error Fetching Bible Passage",
          body: "Please try again later.",
          thumbnailUrl: "https://files.catbox.moe/zt9ie6.jpg", // Replace with a suitable thumbnail URL
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true,
        },
      },
    });
  }
});

keith({
  nomCom: "define",
  aliases: ["dictionary", "dict", "def"],
  reaction: '😁',
  categorie: "Search"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const term = arg.join(" ");

  if (!term) {
    const replyText = "Please provide a term to define.";
    return repondre(replyText, {
      contextInfo: {
        externalAdReply: {
          title: "Term Definition Required",
          body: replyText,
          thumbnailUrl: conf.URL, // Using configured thumbnail URL
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true,
        }
      }
    });
  }

  try {
    const { data } = await axios.get(`http://api.urbandictionary.com/v0/define?term=${term}`);
    const definition = data.list[0];

    if (definition) {
      const definitionMessage = `
        Word: ${term}
        Definition: ${definition.definition.replace(/\[|\]/g, '')}
        Example: ${definition.example.replace(/\[|\]/g, '')}
      `;

      const replyText = `Word: ${term}\nDefinition: ${definition.definition.replace(/\[|\]/g, '')}\nExample: ${definition.example.replace(/\[|\]/g, '')}`;
      return repondre(replyText, {
        contextInfo: {
          externalAdReply: {
            title: `Definition of ${term}`,
            body: replyText,
            thumbnailUrl: conf.URL, // Using configured thumbnail URL
            sourceUrl: conf.GURL,
            mediaType: 1,
            showAdAttribution: true,
          }
        }
      });
    } else {
      const replyText = `No result found for "${term}".`;
      return repondre(replyText, {
        contextInfo: {
          externalAdReply: {
            title: "No Results Found",
            body: replyText,
            thumbnailUrl: conf.URL, // Using configured thumbnail URL
            sourceUrl: conf.GURL,
            mediaType: 1,
            showAdAttribution: true,
          }
        }
      });
    }
  } catch (error) {
    console.error(error);
    const replyText = "An error occurred while fetching the definition.";
    return repondre(replyText, {
      contextInfo: {
        externalAdReply: {
          title: "Error Fetching Definition",
          body: replyText,
          thumbnailUrl: conf.URL, // Using configured thumbnail URL
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true,
        }
      }
    });
  }
});


keith({
  nomCom: "code",
  aliases: ["session", "pair", "paircode", "qrcode"],
  reaction: '🚀',
  categorie: 'system'
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  if (!arg || arg.length === 0) {
    const replyText = "Example Usage: .code 2541111xxxxx.";
    return repondre(replyText, {
      contextInfo: {
        externalAdReply: {
          title: "Pairing Code",
          body: replyText,
          thumbnailUrl: conf.URL, // Using configured thumbnail URL
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true,
        }
      }
    });
  }

  try {
    // Notify user that pairing is in progress
    const replyText = "*Wait Alpha Md is getting your pair code 💧✅...*";
    await repondre(replyText, {
      contextInfo: {
        externalAdReply: {
          title: "Pairing Code",
          body: replyText,
          thumbnailUrl: conf.URL, // Using configured thumbnail URL
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true,
        }
      }
    });

    // Prepare the API request
    const encodedNumber = encodeURIComponent(arg.join(" "));
    const apiUrl = `https://keith-sessions-pi5z.onrender.com/code?number=${encodedNumber}`;

    // Fetch the pairing code from the API
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data && data.code) {
      const pairingCode = data.code;
      const replyText = `Here is your pairing code: ${pairingCode}`;
      await repondre(replyText, {
        contextInfo: {
          externalAdReply: {
            title: "Pairing Code",
            body: replyText,
            thumbnailUrl: conf.URL, // Using configured thumbnail URL
            sourceUrl: conf.GURL,
            mediaType: 1,
            showAdAttribution: true,
          }
        }
      });
      const secondReplyText = "Here is your pair code, copy and paste it to the notification above or link devices.";
      await repondre(secondReplyText, {
        contextInfo: {
          externalAdReply: {
            title: "Pairing Code",
            body: secondReplyText,
            thumbnailUrl: conf.URL, // Using configured thumbnail URL
            sourceUrl: conf.GURL,
            mediaType: 1,
            showAdAttribution: true,
          }
        }
      });
    } else {
      throw new Error("Invalid response from API.");
    }
  } catch (error) {
    console.error("Error getting API response:", error.message);
    const replyText = "Error getting response from API.";
    await repondre(replyText, {
      contextInfo: {
        externalAdReply: {
          title: "API Error",
          body: replyText,
          thumbnailUrl: conf.URL, // Using configured thumbnail URL
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true,
        }
      }
    });
  }
});



