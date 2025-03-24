const conf = require("./set");

module.exports = async (zk, group) => {
  try {
    // Fetch group metadata
    const metadata = await zk.groupMetadata(group.id);
    const participants = metadata.participants || []; // Get all participants in the group

    // Fetch group profile picture (or use fallback)
    let ppgroup;
    try {
      ppgroup = await zk.profilePictureUrl(group.id, 'image');
    } catch {
      ppgroup = conf.URL; // Fallback URL if profile picture cannot be fetched
    }

    // Check if events are enabled
    if (conf.EVENTS === 'yes') {
      // Handle "add" action (new members added)
      if (group.action === "add") {
        let msg = `👋 Hello\n`;
        for (let member of group.participants) {
          msg += ` *@${member.split("@")[0]}* Welcome to Our Official Group,\n`;
        }
        msg += `You might want to read the group Description to avoid getting removed...`;

        await zk.sendMessage(group.id, {
          image: { url: ppgroup },
          caption: msg,
          mentions: group.participants // Mention all new members
        });
      }

      // Handle "remove" action (members left)
      else if (group.action === "remove") {
        let msg = `One or some member(s) left the group;\n`;
        for (let member of group.participants) {
          msg += `@${member.split("@")[0]}\n`;
        }

        await zk.sendMessage(group.id, {
          text: msg,
          mentions: group.participants // Mention all members who left
        });
      }
    }
  } catch (e) {
    console.error("Error in group event handler:", e); // Log any errors
  }
};
