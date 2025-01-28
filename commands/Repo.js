const axios = require("axios");
const { keith } = require(__dirname + "/../keizzah/keith");
const { format } = require(__dirname + "/../keizzah/mesfonctions");
const os = require('os');
const moment = require("moment-timezone");
const settings = require(__dirname + "/../set");

const readMore = String.fromCharCode(8206).repeat(4001);

const formatUptime = (seconds) => {
    seconds = Number(seconds);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return [
        days > 0 ? `${days} ${days === 1 ? "day" : "days"}` : '',
        hours > 0 ? `${hours} ${hours === 1 ? "hour" : "hours"}` : '',
        minutes > 0 ? `${minutes} ${minutes === 1 ? "minute" : "minutes"}` : '',
        remainingSeconds > 0 ? `${remainingSeconds} ${remainingSeconds === 1 ? "second" : "seconds"}` : ''
    ].filter(Boolean).join(', ');
};

// Fetch GitHub stats and multiply by 10
const fetchGitHubStats = async () => {
    try {
        const response = await axios.get("https://api.github.com/repos/Keithkeizzah/ALPHA-MD");
        const forksCount = response.data.forks_count * 10; // Multiply forks by 10
        const starsCount = response.data.stargazers_count * 10; // Multiply stars by 10
        const totalUsers = forksCount + starsCount; // Assuming totalUsers is just the sum
        return { forks: forksCount, stars: starsCount, totalUsers };
    } catch (error) {
        console.error("Error fetching GitHub stats:", error);
        return { forks: 0, stars: 0, totalUsers: 0 };
    }
};

keith({
    nomCom: "repo",
    aliases: ["script", "sc"],
    reaction: '⚪',
    nomFichier: __filename
}, async (command, reply, context) => {
    const { repondre, auteurMessage } = context;

    try {
        const response = await axios.get("https://api.github.com/repos/Keithkeizzah/ALPHA-MD1");
        const repoData = response.data;

        if (repoData) {
            // Multiply forks and stars by 10
            const repoInfo = {
                stars: repoData.stargazers_count * 10,
                forks: repoData.forks_count * 10,
                updated: repoData.updated_at,
                owner: repoData.owner.login
            };

            const releaseDate = new Date(repoData.created_at).toLocaleDateString('en-GB');
            const message = `
            *Hello ,,,👋This is 𝐀𝐋𝐏𝐇𝐀-𝐌𝐃*
            the best bot in the universe developed by Kᴇɪᴛʜ Kᴇɪᴢᴢᴀʜ,,fork and give a star 🌟 to my repo
     ╭────────────────
     │✞  *Stars:* - ${repoInfo.stars}
     │✞  *Forks:* - ${repoInfo.forks}
     │✞  *Release date:* - ${releaseDate}
     │✞  *Repo:* - ${repoData.html_url}
     │✞  *Owner:*   *keithkeizzah*
     ╰─────────────────── `;

            await reply.sendMessage(command, {
                text: message,
                contextInfo: {
                    mentionedJid: [auteurMessage],
                    externalAdReply: {
                        title: "✨𝗔𝗟𝗣𝗛𝗔-𝗠𝗗🌟",
                        body: "POWERED BY KEITH",
                        thumbnailUrl: "https://i.imgur.com/q7nH7wI.jpeg",
                        sourceUrl: "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            });
        } else {
            console.log("Could not fetch data");
            repondre("An error occurred while fetching the repository data.");
        }
    } catch (error) {
        console.error("Error fetching repository data:", error);
        repondre("An error occurred while fetching the repository data.");
    }
});
