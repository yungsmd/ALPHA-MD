const { keith } = require("../keizzah/keith");
const { Catbox } = require("node-catbox");
const fs = require('fs-extra');
const { downloadAndSaveMediaMessage } = require('@whiskeysockets/baileys');
const conf = require(__dirname + '/../set');

// Initialize Catbox
const catbox = new Catbox();

// Function to upload a file to Catbox and return the URL
async function uploadToCatbox(filePath) {
  try {
    const uploadResult = await catbox.uploadFile({ path: filePath });
    if (uploadResult && uploadResult.fileUrl) {
      return uploadResult.fileUrl;  // Assuming uploadResult has a fileUrl property
    } else {
      throw new Error("Error retrieving file link");
    }
  } catch (error) {
    throw new Error(String(error));
  }
}

// Command to upload image, video, audio, or other media file
keith({
  nomCom: 'url',          // Command to trigger the function
  categorie: "General",   // Command category
  reaction: '👨🏿‍💻'       // Reaction to use on command
}, async (groupId, client, context) => {
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
    await client.sendMessage(groupId, {
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
