
const { keith } = require('../keizzah/keith');
var gis = require('g-i-s');

keith({
  nomCom: "img",
  categorie: "Search",
  reaction: "📷"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  if (!arg[0]) {
    repondre('which image ? !');
    return;
  }

  const searchTerm = arg.join(" ");
  // repondre("termes " + searchTerm);
  gis(searchTerm, envoiImage);

  async function envoiImage(e, r) {
    if (e) {
      repondre("oups une error ");
    } else {
      const images = r.slice(0, 5).map(img => ({ url: img.url }));

      // Send images in a single message as a horizontal list
      await zk.sendMessage(dest, {
        image: {
          url: images[0].url, // Placeholder for the first image
          caption: searchTerm
        },
        mediaList: images.map(img => ({ image: { url: img.url } })),
        contextInfo: {
          externalAdReply: {
            title: "Search Results",
            body: "Here are your images:",
            mediaType: 1,
            thumbnailUrl: images[0].url,
            showAdAttribution: true,
          }
        }
      }, { quoted: ms });
    }
  }
});
 
