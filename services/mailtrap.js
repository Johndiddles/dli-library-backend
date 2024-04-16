const { MailtrapClient } = require("mailtrap");
require("dotenv").config();

const mailtrapClient = new MailtrapClient({
  endpoint: process.env.MAIL_ENDPOINT,
  token: process.env.MAIL_TOKEN,
});

const newMail = async ({ name, message, email, recipients }) =>
  await mailtrapClient.send({
    from: {
      email: "mailtrap@demomailtrap.com",
      name: "DLI Library Support",
    },
    to: recipients,
    subject: `REQUEST FROM: ${name} - ${email}`,
    text: message,
    category: "Support",
  });

module.exports = { newMail };
