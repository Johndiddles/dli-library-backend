const express = require("express");
const { auth } = require("google-auth-library");
const { google } = require("googleapis");

const app = express();

// app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/", async (req, res) => {
  //   const auth = new google.auth.GoogleAuth({
  //     keyFile: "credentials.json",
  //     scopes: "https://www.googleapis.com/auth/spreadsheets",
  //   });
  //   // create client instance for auth
  //   const client = await auth.getClient();
  //   // instance of google sheets api
  //   const googleSheets = google.sheets({
  //     version: "v4",
  //     auth: client,
  //   });
  //   const spreadsheetId = "1KGYkt6TXxt5s4PsbWA8xU0ylOz6kPMxu2NeS9PU9eT0";
  //   //get metadata about spreadsheet
  //   const metaData = await googleSheets.spreadsheets.get({
  //     auth,
  //     spreadsheetId,
  //   });
  //   //read rows from spreadsheet
  //   const getRows = await googleSheets.spreadsheets.values.get({
  //     auth,
  //     spreadsheetId,
  //     range: "Sheet1",
  //   });
  //   //write row(s) to spreadsheet
  //   await googleSheets.spreadsheets.values.append({
  //     auth,
  //     spreadsheetId,
  //     range: "Sheet1",
  //     valueInputOption: "USER_ENTERED",
  //     resource: {
  //       values: [
  //         [
  //           "1",
  //           "ACC1000",
  //           "GoogleSheets for Database",
  //           "3",
  //           "https://johndiddles.vercel.app",
  //         ],
  //       ],
  //     },
  //   });
  //   res.send(getRows.data);
});

app.listen(1337, () => {
  console.log("server is running on 1337");
});
