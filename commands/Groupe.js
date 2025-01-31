const { keith } = require("../kezzah/keith");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { ajouterOuMettreAJourJid, mettreAJourAction, verifierEtatJid } = require("../bdd/antilien");
const { atbajouterOuMettreAJourJid, atbverifierEtatJid } = require("../bdd/antibot");
const { search, download } = require("aptoide-scraper");
const fs = require("fs-extra");
const conf = require("../set");
const { default: axios } = require('axios');

keith({ nomCom: "tagall", categorie: 'Group', reaction: "📣" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

  // Ensure command is for a group
  if (!verifGroupe) { 
    repondre("✋🏿 ✋🏿this command is reserved for groups ❌"); 
    return; 
  }

  // If no message argument, set a default message
  let mess = arg && arg.trim() ? arg.join(' ') : 'Aucun Message';

  // Get group participants if it's a group
  let membresGroupe = verifGroupe ? await infosGroupe.participants : [];

  // Prepare the initial message tag
  let tag = `========================\n  
        🌟 *ALPHA-MD* 🌟
========================\n
👥 Group : ${nomGroupe} 🚀 
👤 Author : *${nomAuteurMessage}* 👋 
📜 Message : *${mess}* 📝
========================\n\n`;

  // Emoji array and random selection logic
  const emoji = ['🦴', '👀', '😮‍💨', '❌', '✔️', '😇', '⚙️', '🔧', '🎊', '😡', '🙏🏿', '⛔️', '$', '😟', '🥵', '🐅'];
  const random = Math.floor(Math.random() * emoji.length); // Fixed random calculation

  // Loop through the group members, numbering them from 1 to last
  membresGroupe.forEach((membre, index) => {
    tag += `${index + 1}. ${emoji[random]} @${membre.id.split("@")[0]}\n`;
  });

  // Send the message if user is an admin or super user
  if (verifAdmin || superUser) {
    zk.sendMessage(dest, { text: tag, mentions: membresGroupe.map(m => m.id) }, { quoted: ms });
  } else {
    repondre('command reserved for admins');
  }
});
