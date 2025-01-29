const { keith } = require('../keizzah/keith');
const { igdl } = require("ruhend-scraper");
const conf = require(__dirname + "/../set");

keith({
  nomCom: "instagram",
  aliases: ["igdl", "ig", "insta"],
  categorie: "Download",
  reaction: "📽️"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  // Check if the argument (Instagram link) is provided
  if (!arg[0]) {
    return repondre('Please provide a valid public Instagram video link!');
  }

  // Validate the Instagram URL format
  if (!arg[0].includes('https://www.instagram.com/')) {
    return repondre("That is not a valid Instagram link.");
  }

  try {
    // Fetch the download data for the Instagram video
    let downloadData = await igdl(arg[0]);

    // Check if the data returned is valid
    if (!downloadData || !downloadData.data || downloadData.data.length === 0) {
      return repondre("No video found at the provided Instagram link.");
    }

    let videoData = downloadData.data;

    // Process the first 20 videos (if available)
    for (let i = 0; i < Math.min(20, videoData.length); i++) {
      let video = videoData[i];

      // Ensure the video object and URL are defined
      if (!video || !video.url) {
        continue; // Skip if the video data is incomplete
      }

      let videoUrl = video.url;

      // Send the video to the chat
      await zk.sendMessage(dest, {
        video: { url: videoUrl },
        mimetype: "video/mp4",
        caption: `*Instagram Video Downloaded by ${conf.BOT}*`,
        contextInfo: {
          externalAdReply: {
            title: `${conf.BOT} IG DL`,
            body: conf.OWNER_NAME,
            thumbnailUrl: conf.URL,
            sourceUrl: conf.GURL,
            mediaType: 1,
            showAdAttribution: true
          }
        }
      }, { quoted: ms });
    }

  } catch (error) {
    // Catch and log any errors
    console.error(error);
    return repondre("An error occurred while processing the request. Please try again later.");
  }
});
