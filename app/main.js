'use strict';

// Import language strings
const lang = require('./lang/main')('en');

const {
  findMpByConstituencyName,
  findConstituency,
} = require('./api/they-work-for-you');

const getPartyName = name => {
  switch (name) {
    case 'Conservative':
      return 'Conservative party';
    case 'Labour':
      return 'Labour party';
    case 'Scottish National Party':
      return 'Scottish National Party';
    default:
      return `${name} party`;
  }
};

module.exports = {
  /**
   * Launch handler
   *
   * @param {function} callback - the callback to use upon completion
   */

  launch: callback => {
    callback(null, {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: lang.get('launch'),
        },
        shouldEndSession: false,
      },
    });
  },

  /**
   * Intent handler
   *
   * @param {object} event - the Alexa intent event object
   * @param {function} callback - the callback to use upon completion
   */
  intent: function(event, callback) {
    switch (event.request.intent.name) {
      /**
       * You can implement custom intents here
      case 'MyCustomIntent':
        this.myCustomIntentHandler(event, callback);
        return;
      */

      case 'AMAZON.HelpIntent':
        this.help(event, callback);
        return;
      case 'AMAZON.StopIntent':
      case 'AMAZON.CancelIntent':
        this.stop(event, callback);
        return;
      case 'MPByConstituencyIntent':
        this.mpByConstituency(event, callback);
        return;
      default:
        this.unknownIntent(event, callback);
        return;
    }
  },

  mpByConstituency: (event, callback) => {
    const constituencyName = event.request.intent.slots.constituency.value;

    if (!constituencyName) {
      callback(null, {
        version: '1.0',
        response: {
          outputSpeech: {
            type: 'PlainText',
            text: `I'm sorry, I didn't understand that. Try, "Tell me about the MP for Maidenhead".`,
          },
          shouldEndSession: false,
        },
      });
    } else {
      findMpByConstituencyName(constituencyName)
        .then(data => {
          if (data.error) {
            return findConstituency(constituencyName).then(results => {
              if (results.length > 0)
                return findMpByConstituencyName(results[0].name).then(data => {
                  if (data.error)
                    throw new Error(
                      `Unable to find constituency ${constituencyName}`
                    );

                  return data;
                });

              throw new Error(`Unable to find constituency`);
            });
          }

          return data;
        })
        .then(data => {
          callback(null, {
            version: '1.0',
            response: {
              outputSpeech: {
                type: 'SSML',
                ssml: `<speak>
                The MP for ${data.constituency} is ${data.full_name} of the ${getPartyName(data.party)}. 
                ${data.office && data.office.length > 0 ? `${data.full_name} holds the position of ${data.office[0].position}, and has held this role since <say-as interpret-as="date" format="ymd">${data.office[0].from_date}</say-as>.` : ``}
              </speak>`,
              },
              shouldEndSession: true,
            },
          });
        })
        .catch(e => {
          callback(null, {
            version: '1.0',
            response: {
              outputSpeech: {
                type: 'PlainText',
                text: `I'm sorry, I wasn't able to find a constituency with the name ${constituencyName}, could you repeat it?`,
              },
              shouldEndSession: false,
            },
          });
        });
    }
  },

  unknownIntent: (event, callback) => {
    callback(null, {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: lang.get('unknownIntent'),
        },
        shouldEndSession: false,
      },
    });
  },

  help: (event, callback) => {
    callback(null, {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: lang.get('help'),
        },
        shouldEndSession: false,
      },
    });
  },

  stop: (event, callback) => {
    callback(null, {
      version: '1.0',
      response: {
        shouldEndSession: true,
      },
    });
  },

  /**
   * You can implement custom intent handlers here

  myCustomIntentHandler: (event, callback) => {
    // Do something with the event data
    callback(null, {});
  }
  */
};
