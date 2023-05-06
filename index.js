const Alexa = require('ask-sdk-core');
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');
const s3Adapter = new persistenceAdapter.S3PersistenceAdapter({bucketName:process.env.S3_PERSISTENCE_BUCKET});

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speakOutput = '¡Bienvenido! ¿Qué comida vas a comer hoy?';
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

const AddFoodIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AddFoodIntent';
  },
  async handle(handlerInput) {
    const food = Alexa.getSlotValue(handlerInput.requestEnvelope, 'food');
    const day = Alexa.getSlotValue(handlerInput.requestEnvelope, 'day');
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    let menu = sessionAttributes.menu || {};

    // Add the food to the specified day
    if (menu[day]) {
      menu[day].push(food);
    } else {
      menu[day] = [food];
    }

    // Save the updated menu to session attributes
    sessionAttributes.menu = menu;
    attributesManager.setSessionAttributes(sessionAttributes);

    const speakOutput = `¡Perfecto! He añadido ${food} para el día ${day}. ¿Quieres añadir otra comida o consultar el menú?`;
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

const GetMenuIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetMenuIntent';
  },
  async handle(handlerInput) {
    const day = Alexa.getSlotValue(handlerInput.requestEnvelope, 'day');
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    const menu = sessionAttributes.menu || {};

    // Check if the specified day has any foods
    if (!menu[day]) {
      const speakOutput = `Lo siento, no tienes nada planeado para el día ${day}. ¿Quieres añadir algo al menú?`;
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    }

    // Construct a string of all the foods for the specified day
    const foodList = menu[day].join(', ');
    const speakOutput = `Para el día ${day}, tienes planeado comer: ${foodList}. ¿Quieres añadir algo más al menú?`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
      const speakOutput = 'Puedes decirme lo que vas a comer para cada día de la semana y luego preguntarme qué vas a comer en un día específico. Por ejemplo, "Alexa, hoy voy a comer pizza" y luego "Alexa, ¿qué voy a comer el miércoles?"';
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    }
  };
  
  const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
          || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
      const speakOutput = '¡Adiós!';
  
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    }
  };
  
  const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
      // Any cleanup logic goes here.
      return handlerInput.responseBuilder.getResponse();
    }
  };
  
  const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
  
      const speakOutput = 'Lo siento, ha ocurrido un error. Por favor inténtalo de nuevo.';
  
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    }
  };
  

  const GetFoodIntentHandler = {
    canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetFoodIntent';
    },
    handle(handlerInput) {
        const daySlot = handlerInput.requestEnvelope.request.intent.slots.day.value.toLowerCase();
        let speakOutput = '';
    
        switch (daySlot) {
          case 'lunes':
            speakOutput = 'Hoy lunes vas a comer pollo asado con arroz y ensalada.';
            break;
          case 'martes':
            speakOutput = 'Hoy martes vas a comer spaghetti con albóndigas y ensalada.';
            break;
          case 'miércoles':
            speakOutput = 'Hoy miércoles vas a comer hamburguesa con papas fritas.';
            break;
          case 'jueves':
            speakOutput = 'Hoy jueves vas a comer pollo a la plancha con puré de papas.';
            break;
          case 'viernes':
            speakOutput = 'Hoy viernes vas a comer pizza de pepperoni y ensalada.';
            break;
          case 'sábado':
            speakOutput = 'Hoy sábado vas a comer tacos de carne asada.';
            break;
          case 'domingo':
            speakOutput = 'Hoy domingo vas a comer arroz con pollo.';
            break;
          default:
            speakOutput = 'Lo siento, no tengo información sobre ese día.';
        }
    
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .getResponse();
      }
    };
    