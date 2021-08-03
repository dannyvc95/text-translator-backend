require("dotenv").config();
const express = require("express");
const LanguageTranslatorV3 = require("ibm-watson/language-translator/v3");
const { IamAuthenticator } = require("ibm-watson/auth");

const app = express();
app.use(express.text());
app.use(express.json());

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  next();
});

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
    .then((languages) => response.send(languages.result));
});

// Get a list of potential detected languages with a score.
app.post(`${process.env.ENDPOINT_BASE}/detect-language`, (request, response) => {
  const identifyParams = {
    text: String(request.body),
  };
  languageTranslator
    .identify(identifyParams)
    .then((detectedLanguages) => response.send(detectedLanguages.result));
});

// Get the translation of a given text.
app.post(`${process.env.ENDPOINT_BASE}/translate`, (request, response) => {
  const translateParams = {
    text: String(request.body.text),
    modelId: `${request.body.source}-${request.body.target}`,
  };
  languageTranslator
    .translate(translateParams)
    .then(({ result }) =>  response.send(result.translations));
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server running on ${process.env.HOST}:${process.env.PORT || 8000}`);
});
