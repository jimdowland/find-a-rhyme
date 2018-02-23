const functions = require('firebase-functions');
const { DialogflowApp } = require('actions-on-google');
var fs = require('fs');
const pronouncing = require('pronouncing');

const common = fs.readFileSync(__dirname + "/popular.txt", { encoding: 'utf8' }).split("\n");

exports.rhymeAction = functions.https.onRequest((request, response) => {
    const app = new DialogflowApp({ request, response });

   if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
       pronouncing.init("/dict_popular_homophones.txt","screen");
      } else {
        pronouncing.init("/dict_popular_homophones.txt","no_screen");
        }

    // Fulfill action business logic
    function welcomeHandler(app) {
        // Complete your fulfillment logic and send a response
        app.ask("<speak>Hello, welcome to find a rhyme. <break time='500ms'/> I help you find rhymes for common words. <break time='500ms'/> Say the phrase <emphasis level='moderate'>What rhymes with </emphasis>, followed by the word you want rhymes for.  </speak>");
    }

    function rhymeHandler(app) {
        let wordToRhyme = request.body.result.parameters.wordtorhyme;
        let match = pronouncing.rhymes(wordToRhyme);
        let commonMatch = [];
        if (match.length) {
            commonMatch = checkCommon(common, match);
        }

        if (commonMatch.length) {
            let responseString = "<speak>";
            commonMatch.forEach((word)=>{responseString += word + " <break time='500ms'/>"});
            responseString += "</speak>";
            app.ask(responseString);
        } else {
            app.ask("Sorry, I can't find any rhymes");
        }
    }

    function unknownHandler(app) {
    }

    function checkCommon(commonWords, currentMatch) {
        // check word is in common use and remove any dupes
        return(currentMatch.filter((word, idx, filteredArray) => {if(commonWords.includes(word) && filteredArray.indexOf(word)===idx){return(word)}}));
    }


    const actionMap = new Map();
    actionMap.set('input.welcome', welcomeHandler);
    actionMap.set('get.rhymes', rhymeHandler);

    app.handleRequest(actionMap);
});

