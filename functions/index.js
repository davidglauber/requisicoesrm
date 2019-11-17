const functions = require('firebase-functions');
const admin = require('firebase-admin');
const escapeHtml = require('escape-html');

admin.initializeApp()

const auth = admin.auth();

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
 exports.helloWorld = functions.https.onRequest((request, response) => {
  const id = makeid(19);

  let refLamp = admin.database().ref(`usuarios/${request.query.id}/lampadas`).child(`${id}`);

  refLamp.push({
      status:"OFF",
      location: "PADRAO",
      id: id
  })
  
  refLamp.set({
    status:"OFF",
    location: "PADRAO",
    id: id
  }).then(() => {
      response.json({
          message: 'Lâmpada cadastrada com sucesso!',
          id,
      })
  }).catch(() => {
    response.json({
        message: 'que bad, não foi dessa vez :(',
        text
    })
  })
 });

//sensor de água
 exports.sensorChuva = functions.https.onRequest((request, response) => {
    const id = makeid(19);
    console.log('seu id: ' + id)
  
    let refChuva = admin.database().ref(`usuarios/${request.query.id}/agua`).child(`${id}`);
  
    refChuva.push({
        porcetagem:"0",
        location: "PADRAO",
        id: id
    })
    
    refChuva.set({
      porcetagem:"0",
      location: "PADRAO",
      id: id
    }).then(() => {
        response.json({
            message: 'Sensor de chuva cadastrado com sucesso!',
            id
        })
    }).catch(() => {
      response.json({
          message: 'que bad, não foi dessa vez :(',
          text
      })
    })
   });



exports.notificacaoAgua = functions.https.onRequest((request, response) => {
    const id = makeid(19);

    let refNotificacao = admin.database().ref(`usuarios/${request.query.id}/notificacoes/${id}`).child(`${request.query.idSensor}`);
    
    refNotificacao.push({
        message: "O sensor detectou um alto nível de água",
        id: id
    })
    
    refNotificacao.set({
      message: "O sensor detectou um alto nível de água",
      id: id
    }).then(() => {
        response.json({
            message: 'Notificação  cadastrado com sucesso!',
            id
        })
    }).catch(() => {
      response.json({
          message: 'que bad, não foi dessa vez :(',
          text
      })
    })
   });