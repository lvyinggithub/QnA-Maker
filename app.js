'use strict';

const builder = require('botbuilder');
const restify = require('restify');
const cognitiveServices = require('botbuilder-cognitiveservices');

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`${server.name} listening to ${server.url}`);
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

const bot = new builder.UniversalBot(connector);

// Setup QnA Maker
const recognizer = new cognitiveServices.QnAMakerRecognizer({
    knowledgeBaseId: 'f5f1c897-ae6d-4317-829a-ae2f125049a1',
    subscriptionKey: 'c54ac26437f34c8a88ac3167e7350f76' 
});

const qnaMakerDialog = new cognitiveServices.QnAMakerDialog({
    recognizers: [recognizer],
    defaultMessage: 'Sorry, no match found!',
    qnaThreshold: 0.3
});

bot.dialog('/', qnaMakerDialog);
