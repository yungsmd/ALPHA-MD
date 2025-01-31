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

keith({ nomCom: "invite", categorie: 'Group', reaction: "🙋" }, async (dest, zk, commandeOptions) => {
  const { repondre, nomGroupe, nomAuteurMessage, verifGroupe } = commandeOptions;
  if (!verifGroupe) {
    return repondre("Wait bro, do you want the link to my DM?");
  }

  const link = await zk.groupInviteCode(dest);
  const lien = `https://chat.whatsapp.com/${link}`;
  const mess = `Hello ${nomAuteurMessage}, here is the group link of ${nomGroupe} \n\nClick Here To Join: ${lien}`;
  repondre(mess);
});

/** Promote a member to admin */

const stickers = [
  'https://files.catbox.moe/kbue6l.webp',
  'https://files.catbox.moe/vel483.webp',
  'https://files.catbox.moe/kbue6l.webp'
];

/** ***fin démettre**** **/
/** **retirer** */
keith({ nomCom: "remove", categorie: 'Group', reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
  let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, nomAuteurMessage, auteurMessage, superUser, idBot } = commandeOptions;
  let membresGroupe = verifGroupe ? await infosGroupe.participants : "";
  if (!verifGroupe) { return repondre("for groups only"); }

  const verifMember = (user) => {
    for (const m of membresGroupe) {
      if (m.id !== user) continue;
      else return true;
    }
  };

  const memberAdmin = (membresGroupe) => {
    let admin = [];
    for (m of membresGroupe) {
      if (m.admin == null) continue;
      admin.push(m.id);
    }
    return admin;
  };

  const a = verifGroupe ? memberAdmin(membresGroupe) : '';
  let admin = verifGroupe ? a.includes(auteurMsgRepondu) : false;
  let membre = verifMember(auteurMsgRepondu);
  let autAdmin = verifGroupe ? a.includes(auteurMessage) : false;
  let zkad = verifGroupe ? a.includes(idBot) : false;

  try {
    if (autAdmin || superUser) {
      if (msgRepondu) {
        if (zkad) {
          if (membre) {
            if (admin == false) {
              const stickerUrl = stickers[Math.floor(Math.random() * stickers.length)];
              const sticker = new Sticker(stickerUrl, {
                pack: 'ALPHA-MD',
                author: nomAuteurMessage,
                type: StickerTypes.FULL,
                categories: ['🤩', '🎉'],
                id: '12345',
                quality: 50,
                background: '#000000'
              });

              await sticker.toFile("st.webp");
              const txt = `@${auteurMsgRepondu.split("@")[0]} was removed from the group.\n`;
              await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "remove");
              zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] });
              zk.sendMessage(dest, { sticker: fs.readFileSync("st.webp") }, { quoted: msgRepondu });
            } else {
              repondre("This member cannot be removed because he is an administrator of the group.");
            }
          } else {
            return repondre("This user is not part of the group.");
          }
        } else {
          return repondre("Sorry, I cannot perform this action because I am not an administrator of the group.");
        }
      } else {
        repondre("Please tag the member to be removed.");
      }
    } else {
      return repondre("Sorry I cannot perform this action because you are not an administrator of the group.");
    }
  } catch (e) {
    repondre("Oops " + e);
  }
});

/** ***fin démettre**** **/
/** *****fin retirer */

keith({ nomCom: "add", categorie: 'Group', reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
  let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, nomAuteurMessage, auteurMessage, superUser, idBot } = commandeOptions;
  let membresGroupe = verifGroupe ? await infosGroupe.participants : "";
  if (!verifGroupe) { return repondre("for groups only"); } 

  const participants = await zk.groupMetadata(dest);
  const isImAdmin = participants.participants.some(p => p.id === zk.user.jid && p.isAdmin);
  if (!isImAdmin) return repondre("I'm not an admin.");
  const match = msgRepondu?.participant || arg[0];
  if (!match) return repondre('Example: add 254757835036');
  
  const res = await zk.groupParticipantsUpdate(dest, [match], 'add');
if (res === '403') return repondre('Failed, Invite sent.');
  if (res && res !== '200') return repondre(res, { quoted: msgRepondu });

  const stickerUrl = stickers[Math.floor(Math.random() * stickers.length)];
  const sticker = new Sticker(stickerUrl, {
    pack: 'ALPHA-MD',
    author: nomAuteurMessage,
    type: StickerTypes.FULL,
    categories: ['🤩', '🎉'],
    id: '12345',
    quality: 50,
    background: '#000000'
  });

  await sticker.toFile("st.webp");
  zk.sendMessage(dest, { sticker: fs.readFileSync("st.webp") }, { quoted: msgRepondu });
});.



keith({ nomCom: "promote", categorie: 'Group', reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
  let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
  let membresGroupe = verifGroupe ? await infosGroupe.participants : [];

  if (!verifGroupe) return repondre("For groups only");

  const verifMember = (user) => membresGroupe.some(m => m.id === user);
  const memberAdmin = (membresGroupe) => membresGroupe.filter(m => m.admin != null).map(m => m.id);
  const admins = verifGroupe ? memberAdmin(membresGroupe) : [];
  const admin = verifGroupe ? admins.includes(auteurMsgRepondu) : false;
  const membre = verifMember(auteurMsgRepondu);
  const autAdmin = verifGroupe ? admins.includes(auteurMessage) : false;
  const zkad = verifGroupe ? admins.includes(idBot) : false;

  try {
    if (autAdmin || superUser) {
      if (msgRepondu) {
        if (zkad) {
          if (membre) {
            if (!admin) {
              const txt = `🎊🍾 @${auteurMsgRepondu.split("@")[0]} has been promoted as a group Admin.`;
              await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "promote");
              zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] });

              const stickerUrl = stickers[Math.floor(Math.random() * stickers.length)];
              const sticker = new Sticker(stickerUrl, {
                pack: 'ALPHA-MD',
                author: auteurMessage,
                type: StickerTypes.FULL,
                categories: ['🤩', '🎉'],
                id: '12345',
                quality: 50,
                background: '#000000'
              });

              await sticker.toFile("st.webp");
              zk.sendMessage(dest, { sticker: fs.readFileSync("st.webp") }, { quoted: msgRepondu });
            } else {
              return repondre("This member is already an administrator of the group.");
            }
          } else {
            return repondre("This user is not part of the group.");
          }
        } else {
          return repondre("Sorry, I cannot perform this action because I am not an administrator of the group.");
        }
      } else {
        repondre("Please tag the member to be nominated.");
      }
    } else {
      return repondre("Sorry, I cannot perform this action because you are not an administrator of the group.");
    }
  } catch (e) {
    repondre("Oops, something went wrong: " + e);
  }
});

/** Demote a member */
keith({ nomCom: "demote", categorie: 'Group', reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
  let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
  let membresGroupe = verifGroupe ? await infosGroupe.participants : [];

  if (!verifGroupe) return repondre("For groups only");

  const verifMember = (user) => membresGroupe.some(m => m.id === user);
  const memberAdmin = (membresGroupe) => membresGroupe.filter(m => m.admin != null).map(m => m.id);
  const admins = verifGroupe ? memberAdmin(membresGroupe) : [];
  const admin = verifGroupe ? admins.includes(auteurMsgRepondu) : false;
  const membre = verifMember(auteurMsgRepondu);
  const autAdmin = verifGroupe ? admins.includes(auteurMessage) : false;
  const zkad = verifGroupe ? admins.includes(idBot) : false;

  try {
    if (autAdmin || superUser) {
      if (msgRepondu) {
        if (zkad) {
          if (membre) {
            if (admin) {
const txt = `@${auteurMsgRepondu.split("@")[0]} has been removed from their position as a group administrator.`;
              await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "demote");
              zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] });

              const stickerUrl = stickers[Math.floor(Math.random() * stickers.length)];
              const sticker = new Sticker(stickerUrl, {
                pack: 'ALPHA-MD',
                author: auteurMessage,
                type: StickerTypes.FULL,
                categories: ['🤩', '🎉'],
                id: '12345',
                quality: 50,
                background: '#000000'
              });

              await sticker.toFile("st.webp");
              zk.sendMessage(dest, { sticker: fs.readFileSync("st.webp") }, { quoted: msgRepondu });
            } else {
              return repondre("This member is not a group administrator.");
            }
          } else {
            return repondre("This user is not part of the group.");
          }
        } else {
          return repondre("Sorry, I cannot perform this action because I am not an administrator of the group.");
        }
      } else {
        repondre("Please tag the member to be removed.");
      }
    } else {
      return repondre("Sorry, I cannot perform this action because you are not an administrator of the group.");
    }
  } catch (e) {
    repondre("Oops, something went wrong: " + e);
  }
});

keith({ nomCom: "del", categorie: 'Group',reaction:"🧹" }, async (dest, zk, commandeOptions) => {

  const { ms, repondre, verifGroupe,auteurMsgRepondu,idBot, msgRepondu, verifAdmin, superUser} = commandeOptions;
  
  if (!msgRepondu) {
    repondre("Please mention the message to delete.");
    return;
  }
  if(superUser && auteurMsgRepondu==idBot )
  {
    
       if(auteurMsgRepondu==idBot)
       {
         const key={
            remoteJid:dest,
      fromMe: true,
      id: ms.message.extendedTextMessage.contextInfo.stanzaId,
         }
         await zk.sendMessage(dest,{delete:key});return;
       } 
  }

          if(verifGroupe)
          {
               if(verifAdmin || superUser)
               {
                    
                         try{
                
      
            const key=   {
               remoteJid : dest,
               id : ms.message.extendedTextMessage.contextInfo.stanzaId ,
               fromMe : false,
               participant : ms.message.extendedTextMessage.contextInfo.participant

            }        
         
         await zk.sendMessage(dest,{delete:key});return;

             }catch(e){repondre( "I need admin rights.")}
                    
                      
               }else{repondre("Sorry, you are not an administrator of the group.")}
          }

});
