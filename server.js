const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.post("/send", async (req, res) => {
    const data = req.body;
    const message = `
Новая анкета:

Имя: ${data.name}
Фамилия: ${data.surname}

С парой: ${data.withPartner ? "Да" : "Нет"}

${data.withPartner ? `
Партнёр: ${data.partnerName} ${data.partnerSurname}
` : ""}

Ночёвка: ${data.sleep}
`;

    try {
        await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message
        });

        console.log("📩 отправлено в Telegram");
        res.json({ ok: true });

    } catch (err) {
        console.log("ERROR:", err.message);
        res.json({ ok: false });
    }
});

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});