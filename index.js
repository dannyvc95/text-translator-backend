require("dotenv").config();
const express = require("express");
const LanguageTranslatorV3 = require("ibm-watson/language-translator/v3");
const { IamAuthenticator } = require("ibm-watson/auth");
const app = express();
const port = process.env.PORT || 8000;

// IBM Language Translator service instance.
const languageTranslator = new LanguageTranslatorV3({
  version: process.env.VERSION,
  authenticator: new IamAuthenticator({
    apikey: process.env.API_KEY,
  }),
  serviceUrl: process.env.URL,
});

// Get a list of available languages.
app.get(`${process.env.ENDPOINT_BASE}/languages`, (request, response) => {
  languageTranslator
    .listLanguages()
    .then((languages) => response.setHeader("Access-Control-Allow-Origin", "*").send(languages.result));
});

// Get a list of potential detected languages with a score.
app.get(`${process.env.ENDPOINT_BASE}/detect-language`, (request, response) => {
  const identifyParams = {
    text: String(request.body),
  };
  languageTranslator
    .identify(identifyParams)
    .then((detectedLanguages) =>response.setHeader("Access-Control-Allow-Origin", "*").send(detectedLanguages.result));
});

app.get(`${process.env.ENDPOINT_BASE}/translate`, (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*").send("Translation service not available for the moment.");
});

app.listen(port, () => {
  console.log(`Server running on ${process.env.ENV}:${port}`);
});
