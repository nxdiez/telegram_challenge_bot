const express = require('express');
const app = express();
const { telegramSetup } = require('./keys.js');
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

//const { TELEGRAM_BOT_TOKEN } = process.env;
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const Telegram = require('telegraf/telegram');

const challengerFotoFimihastag = 'challengerFimi';
const bot = new Telegraf(telegramSetup.TELEGRAM_BOT_TOKEN)
const challengerFimiRx = new RegExp(challengerFotoFimihastag, 'gi'); ///challengerFimi/gi
/* Función para obtnener el tipo de mensaje
  - in: c
      - ctx. Contexto ver documentacion de telegraf
      - message. Mensaje recibido
  - output:
      - string:   
            -photo:  el mensaje es de tipo foto, puede tener o no comentario
            -text:   el mensaje es texto simple (o cualquier otra cosa [ToDo arreglar logica para mensajes de tipo audio, video etc])
      
*/
function messageType(ctx,message){
  var type;
  console.log('update subtypes:' + ctx.updateSubTypes)
  switch(ctx.updateType){
    case 'message':
      if(ctx.updateSubTypes.includes('photo'))
        type = 'photo'
      if(ctx.updateSubTypes.includes('text'))
        type = 'text'
      if(ctx.updateSubTypes.includes('document'))
        type = 'document'
      break;
    case 'edited_message':
      if (message.photo) type = 'photo';
      if (message.document) type = 'document';
      if (message.text) type = 'text';
      break;
  }
  if (type === 'document'){
    //comprobar mime_type si es image/*, cambiamos el tipo a photo
    if(message.document.mime_type.match(/image\/*/))
        type = 'photo';
  }
  console.log( 'Message Type =>' + type);
  return type;
}
/* Función para procesar un mensaje recibido por el bot.
   - ctx. Contexto. ver documentacion de Telegraf.
*/
function processMessage(ctx){
  //en función del Tipo de actualizzación. tomo mensaje original o editado
  //ver documentación Telegraf seccion update Types
  var message = (ctx.updateType === 'message'?ctx.message:ctx.editedMessage);
  console.log(message);
  //en función del tipo de mensaje
  
  switch(messageType(ctx, message)){   
    case "photo"://cuando es foto
      if (isPhotoChallenger(message)){ //valido si es un mensaje para el fimiChallenger
        sendPhotoToAdminPhotoChallenger(ctx,message)
      }else{
        ctx.reply('Tienes que incluir el hashtag #' + challengerFotoFimihastag + ' al enviar la foto. Recuerda que puedes editar el mensaje.') 
      }
      break;
    case "text": //Tipo Texto
      answerText(ctx)
      break;
  }
}
/* Funcion que responde 
*/
function answerText(ctx){

  
  //para que no salga cada mensaje  solo salga de 1 de cada 50 mensajes. 2% de los mensajes enviados
  if(Math.random() < 0.98)//si es menor de 0.98 salimos de la función
    return;
  var mess;  
  // consigo un numero de 0 a 9. Math.random devuelve un decimal entre 0 y 1. multiplacamos por 10 y lo pasamos a entero base 10.
  switch(parseInt( (Math.random() * 10), 10)){
    case 0:
      mess = 'Aha.. qué interesante!';
      break;
    case 1:
      mess = 'si señor ok señor';
      break;
    case 2:
      mess = 'LAS PLACAS SON OBLIGATORIAS';
      break;
    case 3:
      mess = 'No me interesa lo que dices';
      break;
    case 4:
      mess = 'Vete y sal a volar';
      break;
    case 5:
      mess = 'Cuidado con los cables!, que estarán pelaos';
      break;
    case 6:
      mess = 'entre tu y yo. Los del clan no son buena gente';
      break;
    case 7:
      mess = 'GRABA LA PANTALLA'
      break;
    case 8:
      mess = 'Seguro que lo que me preguntas está respondido en el anclado'
      break;
    case 9:
      mess = 'Me abuuurrrrooo'
      break;
  }
  //contestamos en la conversación actual.
  ctx.reply(mess) 
  
}
/* Función que comprueba si el mensaje recibido es un mensaje válido para el challeger de foto
[ToDo: validar contra una base de datos donde encontremos el hashtag activo para el challenger de foto.]
*/
function isPhotoChallenger(message){
  //[challengerFimiRx = getHashTag('challengerFoto')]
  if(message.caption_entities) //en caption entities hay una array de objetos de tipo hashtag, menciones, links, etc
  for (var i = 0, len = message.caption_entities.length; i < len; i++) {
    var entity = message.caption_entities[i]
    if(entity.type === 'hashtag'){//solo trabajamos con las entidades de tipo hashtag
      //localizamos el hashtag dentro del mensaje
      var hashtag = message.caption.substr(entity.offset + 1, entity.length)
      //si el hashtag es el definido para el reto devolvemos ok
      if(hashtag.match( challengerFimiRx))
      return true
    }
   
  }
  //si no encontramos devolvemos false.
  return false;
}
/*
Función que envía una copia modificado del mensaje a las personas, grupos seleccionados
[ToDo, implementar un array o BD donde decidir quién recibe los mensajes]
*/
function sendPhotoToAdminPhotoChallenger(ctx,message){
  //edito el mensaje a mi gusto.
    message.caption = '#' + challengerFotoFimihastag  + ' by @' + message.from.username;
    ctx.telegram.sendCopy(process.env.NXDIEZ,message); //nxdiez
    //ctx.telegram.sendCopy(process.env.DAVID2C,message); //David 2C
    //ctx.telegram.sendCopy(process.env.GRUPOFOTOS,message); //grupo fotos
    ctx.reply( 'Tu foto se ha enviado correctamente y está pendiente de ser validada. Muchas gracias por participar!' )
    console.log('Enviado');
}

/*En cada mensaje recibido o editado, donde el bot tenga permiso de lectura sobre todos los mensajes, ejecutamos la función processMessage
*/
bot.on(['message','edited_message'], (ctx) => {
      processMessage(ctx)
      });
bot.launch()
