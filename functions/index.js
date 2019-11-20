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



//sensor de presença
 exports.presenca = functions.https.onRequest((request, response) => {
    const id = makeid(19);
    console.log('seu id: ' + id)
  
    let refPresenca = admin.database().ref(`usuarios/${request.query.id}/presenca`).child(`${id}`);
  
    refPresenca.push({
        movimento:"SEM MOVIMENTO",
        location: "PADRAO",
        id: id
    })
    
    refPresenca.set({
      movimento:"SEM MOVIMENTO",
      location: "PADRAO",
      id: id
    }).then(() => {
        response.json({
            message: 'Sensor de presença cadastrado com sucesso!',
            id
        })
    }).catch(() => {
      response.json({
          message: 'que bad, não foi dessa vez :(',
          text
      })
    })
   });




//sensor de umidade
 exports.umidade = functions.https.onRequest((request, response) => {
  const id = makeid(19);
  console.log('seu id: ' + id)

  let refUmidade = admin.database().ref(`usuarios/${request.query.id}/umidade`).child(`${id}`);

  refUmidade.push({
      status:"SEM UMIDADE",
      location: "PADRAO",
      id: id
  })
  
  refUmidade.set({
    status:"SEM UMIDADE",
    location: "PADRAO",
    id: id
  }).then(() => {
      response.json({
          message: 'Sensor de presença cadastrado com sucesso!',
          id
      })
  }).catch(() => {
    response.json({
        message: 'que bad, não foi dessa vez :(',
        text
    })
  })
 });



exports.notificacao = functions.https.onRequest((request, response) => {
    const id = makeid(19);

    let refNotificacao = admin.database().ref(`usuarios/${request.query.id}/notificacoes`).child(`${request.query.idSensor}`);
    
    refNotificacao.push({
        message: request.query.message,
        id: request.query.idSensor
    })
    
    refNotificacao.set({
      message: request.query.message,
      id: request.query.idSensor
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

