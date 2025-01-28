
const { keith } = require('../keizzah/keith');
var gis = require('g-i-s');
const conf = require(__dirname + '/../set');

keith({
  nomCom: "img",
  aliases: ["image", images"],
  categorie: "Search",
  reaction: "📷"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  if (!arg[0]) {
    repondre('Which image?');
    return;
  }

  const searchTerm = arg.join(" ");
  gis(searchTerm, sendImage);

  function sendImage(error, results) {
    if (error) {
      repondre("Oops, an error occurred.");
    } else {
      for (var i = 0; i < 5; i++) {
        zk.sendMessage(dest, {
          image: { url: results[i].url },
          caption: `Downloaded by ${conf.BOT}`
        },
        {
          contextInfo: {
            externalAdReply: {
              title: "Image Search Result",
              body: `Here's the image you searched for: ${searchTerm}`,
              thumbnailUrl: results[i].url,
              sourceUrl: conf.GURL,
              mediaType: 1,
              showAdAttribution: true
            }
          }
        },
        { quoted: ms });
      }
    }
  }
});
