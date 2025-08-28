module.exports = {
  GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID || "",
  GOOGLE_SHEET_RANGE: process.env.GOOGLE_SHEET_RANGE || "Sheet1!A2:L",

  MESSAGE_TEMPLATE: `Halo kak {participant_name}
perkenalkan saya ${process.env.FACILITATOR_NAME}, fasilitator kakak di program *Google Cloud Arcade Fasilitator 2025*. Deadline tersisa *19 hari lagi*, saya perhatikan sejauh ini kakak belum memperoleh badge. Kalau ada kendala atau butuh bantuan, silakan sampaikan ya. Supaya saya bisa bantu carikan solusinya 😊

Terima kasih atas perhatiannya!

> Pesan ini dikirim secara otomatis. Jika progress sudah berjalan tapi belum terbaca oleh sistem, silakan abaikan.
`,

  FILTER_LOGIC: (item) => {
    const skillBadges = parseInt(item.total_skill_badges, 10) || 0;
    const arcadeGames = parseInt(item.total_arcade_games, 10) || 0;
    const triviaGames = parseInt(item.total_trivia_games, 10) || 0;

    return skillBadges === 0 && arcadeGames === 0 && triviaGames === 0;
  },

  MESSAGE_INTERVAL_MIN: 500,
  MESSAGE_INTERVAL_MAX: 1000,
};
