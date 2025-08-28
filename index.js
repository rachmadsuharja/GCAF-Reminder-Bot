const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { google } = require("googleapis");
const fs = require("fs");
const readline = require("readline");
const csv = require("csv-parser");
require("dotenv").config();
const config = require("./config");

async function getDataFromGoogleSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets.readonly",
  });
  const sheets = google.sheets({ version: "v4", auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.GOOGLE_SHEET_ID,
    range: config.GOOGLE_SHEET_RANGE,
  });

  const headers = [
    "participant_name",
    "participant_email",
    "phone_number",
    "google_cloud_profile_url",
    "redeem_status",
    "access_code",
    "completed_milestones",
    "total_skill_badges",
    "skill_badge_list",
    "total_arcade_games",
    "arcade_game_list",
    "total_trivia_games",
    "trivia_game_list",
  ];

  return response.data.values.map((row) => {
    let obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] || "";
    });
    return obj;
  });
}

async function getDataFromCSV(filePath = "data.csv") {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

function randomDelay(min, max) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox"],
  },
});

function askUserConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

console.log("Initializing WhatsApp client...");

client.on("qr", (qr) => {
  console.log("Scan this QR code with your device (bot account recommended).");
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("Successfully Authenticated!");
});

client.on("ready", async () => {
  console.log("WhatsApp client is ready!");

  try {
    console.log("Fetching participant data...");
    const allParticipants = await getDataFromGoogleSheets();
    console.log(`Total participants found: ${allParticipants.length}`);

    const noProgressParticipants = allParticipants.filter(config.FILTER_LOGIC);
    console.log(
      `${noProgressParticipants.length} participants are currently without progress.`
    );

    if (noProgressParticipants.length === 0) {
      console.log("Everyone has made progress. No reminders required.");
      return;
    }

    const answer = await askUserConfirmation(
      `Proceed with sending messages to ${noProgressParticipants.length} participants? (y/n):`
    );

    if (answer !== "y") {
      console.log("Message sending was canceled by the user.");
      process.exit(0);
    }

    for (const participant of noProgressParticipants) {
      let number = participant.phone_number.replace(/\D/g, "");
      if (number.startsWith("0")) {
        number = "62" + number.substring(1);
      }
      const chatId = `${number}@c.us`;

      const message = config.MESSAGE_TEMPLATE.replace(
        "{participant_name}",
        participant.participant_name.trim()
      );

      await client.sendMessage(chatId, message);

      console.log(
        `Message sent to ${participant.participant_name} (${chatId}).`
      );
      await randomDelay(
        config.MESSAGE_INTERVAL_MIN,
        config.MESSAGE_INTERVAL_MAX
      );
    }

    console.log("Done! All reminder messages have been sent.");
    process.exit();
  } catch (error) {
    console.error("An error occurred during the process:", error);
  }
});

client.on("auth_failure", (msg) => {
  console.error("AUTHENTICATION FAILED", msg);
});

client.on("disconnected", (reason) => {
  console.log("Client disconnected:", reason);
});

client.initialize();
