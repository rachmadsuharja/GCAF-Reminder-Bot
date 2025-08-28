<h1 align="center">GCAF Reminder Bot</h1>

A WhatsApp bot for sending **personalized reminders** to participants of the **Google Cloud Arcade Facilitator (GCAF) 2025** program.  
This bot helps facilitators track participant progress from Google Sheets and automatically send reminder messages to those with no progress.

---

## ✨ Features

- 📊 Fetch participant data directly from **Google Sheets**.
- 🔍 Detect participants with **no progress**.
- 💬 Send **personalized WhatsApp messages** using your own account.
- 🔐 Secure authentication with `whatsapp-web.js` (QR code login).
- ⚡ Simple and efficient setup with environment variables.

---

## 📦 Tech Stack

- [Node.js](https://nodejs.org/) – Runtime environment
- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) – WhatsApp automation
- [googleapis](https://github.com/googleapis/google-api-nodejs-client) – Google Sheets API
- [dotenv](https://github.com/motdotla/dotenv) – Environment variables
- [csv-parser](https://github.com/mafintosh/csv-parser) – CSV data parsing (optional)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/rachmadsuharja/GCAF-Reminder-Bot.git
cd GCAF-Reminder-Bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a .env file in the root directory:

```env
GOOGLE_SHEET_ID=your_google_sheet_id
GOOGLE_SHEET_RANGE=Sheet1!A2:L
FACILITATOR_NAME=Your Name
```

### 4. Add Google credentials

Download your Google Service Account credentials as credentials.json and place it in the project root.

### 5. Run the bot

```bash
   node index.js
```

Scan the QR code with your WhatsApp app to log in.

## ⚙️ Configuration

The bot uses a customizable message template in config.js:

```js
MESSAGE_TEMPLATE:
`Halo kak {participant_name}!

Perkenalkan saya ${process.env.FACILITATOR_NAME}, fasilitator kakak di program *Google Cloud Arcade Fasilitator 2025*. Deadline tersisa *${process.env.PROGRAM_DEADLINE}*, saya perhatikan sejauh ini kakak belum memperoleh badge. Kalau ada kendala atau butuh bantuan, silakan sampaikan ya. Supaya saya bisa bantu carikan solusinya 😊

Terima kasih atas perhatiannya!

> Pesan ini dikirim secara otomatis. Jika progress sudah berjalan tapi belum terbaca oleh sistem, silakan abaikan.`,
```

Available placeholders:

- {participant_name} → Participant's name
- ${process.env.FACILITATOR_NAME} → Your name (from .env)

## 📂 Project Structure

```bash
GCAF-Reminder-Bot/
│── config.js # Configuration and message template
│── index.js # Main bot script\
│── credentials.json # Google service account credentials
│── .env # Environment variables
```

## 🔒 Notes

- Use a dedicated WhatsApp number (recommended: bot account).
- Ensure Google Sheet sharing permissions are properly set for the Service Account.
- Do not share credentials.json or .env publicly.

## 🤝 Contributing

Contributions are welcome! If you’d like to improve this project, please follow these steps:

1. **Fork** the repository
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m "Add: your feature description"
   ```
4. **Push** to your branch
   ```bash
   git push origin feature/your-feature
   ```
5. Open a **Pull Request** and describe your changes

#### Contribution Guidelines

- Use clear and concise commit messages.
- Keep pull requests focused on one feature/fix at a time.
- Follow the existing code style and structure.
- Make sure your changes do not break existing functionality.
