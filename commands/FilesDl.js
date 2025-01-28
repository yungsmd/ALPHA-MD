
const { keith } = require('../keizzah/keith');
const axios = require('axios');
const { Catbox } = require("node-catbox");
const fs = require('fs-extra');
const { downloadAndSaveMediaMessage } = require('@whiskeysockets/baileys');
const conf = require(__dirname + "/../set");
// Initialize Catbox
const catbox = new Catbox();

// Function to upload a file to Catbox and return the URL
async function uploadToCatbox(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("File does not exist");
  }
  try {
    const uploadResult = await catbox.uploadFile({ path: filePath });
    if (uploadResult) {
      return uploadResult;
    } else {
      throw new Error("Error retrieving file link");
    }
  } catch (error) {
    throw new Error(String(error));
  }
}

keith({
  nomCom: 'apk',
  aliases: ['app', 'playstore'],
  reaction: '✨',
  categorie: 'Download'
}, async (groupId, client, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  // Check if app name is provided
  const appName = arg.join(" ");
  if (!appName) {
    return repondre("Please provide an app name.");
  }

  try {
    // Fetch app search results from the BK9 API
    const searchResponse = await axios.get(`https://bk9.fun/search/apk?q=${appName}`);
    const searchData = searchResponse.data;

    // Check if any results were found
    if (!searchData.BK9 || searchData.BK9.length === 0) {
      return repondre("No app found with that name, please try again.");
    }

    // Fetch the APK details for the first result
    const appDetailsResponse = await axios.get(`https://bk9.fun/download/apk?id=${searchData.BK9[0].id}`);
    const appDetails = appDetailsResponse.data;

    // Check if download link is available
    if (!appDetails.BK9 || !appDetails.BK9.dllink) {
      return repondre("Unable to find the download link for this app.");
    }

    const thumb = appDetails.BK9.thumbnail || conf.URL; // Fallback to conf.URL if thumbnail is not provided

    // Send the APK file to the group with thumbnail
    await client.sendMessage(groupId, {
      document: { url: appDetails.BK9.dllink },
      fileName: `${appDetails.BK9.name}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption: `Downloaded by ${conf.OWNER_NAME}`,
      contextInfo: {
        externalAdReply: {
          mediaUrl: thumb,
          mediaType: 1,
          thumbnailUrl: thumb,
          title: "Alpha APK Download",
          body: appDetails.BK9.name,
          sourceUrl: conf.GURL, // Using configured source URL
          showAdAttribution: true
        }
      }
    }, { quoted: ms });

  } catch (error) {
    // Catch any errors and notify the user
    console.error("Error during APK download process:", error);
    repondre("APK download failed. Please try again later.");
  }
});


keith({
  nomCom: 'url',          // Command to trigger the function
  categorie: "General",   // Command category
  reaction: '👨🏿‍💻'       // Reaction to use on command
}, async (dest, zk, context) => {
  const { msgRepondu, repondre, ms } = context;

  // If no message (image/video/audio) is mentioned, prompt user
  if (!msgRepondu) {
    return repondre("Please mention an image, video, audio document, sticker, or any other media.");
  }

  let mediaPath;

  // Check and download the media from the message
  if (msgRepondu.videoMessage) {
    mediaPath = await downloadAndSaveMediaMessage(msgRepondu, 'video');
  } else if (msgRepondu.stickerMessage) {
    mediaPath = await downloadAndSaveMediaMessage(msgRepondu, 'sticker');
  } else if (msgRepondu.gifMessage) {
    mediaPath = await downloadAndSaveMediaMessage(msgRepondu, 'gif');
  } else if (msgRepondu.documentMessage) {
    mediaPath = await downloadAndSaveMediaMessage(msgRepondu, 'document');
  } else if (msgRepondu.imageMessage) {
    mediaPath = await downloadAndSaveMediaMessage(msgRepondu, 'image');
  } else if (msgRepondu.audioMessage) {
    mediaPath = await downloadAndSaveMediaMessage(msgRepondu, 'audio');
  } else {
    // If no supported media is found, prompt user
    return repondre("Please mention an image, video, audio, document, sticker, or any other media.");
  }

  try {
    // Upload the media to Catbox and get the URL
    const fileUrl = await uploadToCatbox(mediaPath);

    // Delete the local media file after upload
    fs.unlinkSync(mediaPath);

    // Send the file URL to the user
    await zk.sendMessage(dest, {
      text: fileUrl,
      contextInfo: {
        externalAdReply: {
          title: `${conf.BOT} URL GENERATOR`,
          body: "Here's your awesome 😎 link!",
          thumbnailUrl: conf.URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    }, { quoted: ms });

  } catch (error) {
    console.error("Error while creating your URL:", error);
    repondre("Oops, there was an error.");
  }
});


