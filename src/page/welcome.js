import React from 'react';
import { Link, useHistory } from 'react-router';
import { Page, Panel, Button, Modal, Select, Input, eventBus } from 'react-blur-admin';
import { Row, Col } from 'react-flex-proto';
import './estilo.css';
import lamp from '../lamp.png';
import firebase from '../init/firebase';
import { userInfo } from 'os';
import { IoIosBrush, IoIosCloseCircle } from 'react-icons/io';

export class Welcome extends React.Component {

  constructor() {
    super(); 
      this.state = {
        sensor: true,
        lugaresDisponiveis:[],
        idUsuarioAtual: '',
        confirmacaoDeMudancaState:'',
        location:'',
        selectedFile: null
      }
  }


  componentDidMount() {
    let e = this;

    var emailDoUsuario = '';
    var id = '';
    var lugaresDisponiveis = this.state.lugaresDisponiveis;

    const idUsuarioAtual = this.state.idUsuarioAtual;
    const confirmacaoDeMudancaState = this.state.confirmacaoDeMudancaState;

    const db = firebase.database().ref('usuarios');


    firebase.auth().onAuthStateChanged(function(user) {

      if(user == null || user == undefined) {
        console.log('entrou no if de usuario nulo')
        e.props.router.push({
          pathname: '/login'
        });
      } 

      let firebaseGET = firebase.database().ref(`/usuarios/${user.uid}/locais`)
  
      firebaseGET.on('value', (snap) => {
        var lugares = [];

        snap.forEach((child) => {
          lugares.push({
            location: child.val().location,
            url: child.val().url
          })
        })

        lugaresDisponiveis = lugares
        e.setState({lugaresDisponiveis: lugares})
      })

  })


    try { 
      firebase.auth().onAuthStateChanged(function(user) {
            

        db.on('value', gotData);

        function gotData(data) {
          var b = false;

          console.log('entrou na função de et')
            var confirmed = data.val();


        var confirmedUser = Object.keys(confirmed);

        for(var i = 0; i < confirmedUser.length; i++) {
          var k = confirmedUser[i];
          var confirmacao = confirmed[k].confirmed;

          if(user == null) {
            e.props.router.push({
              pathname: '/login'
            });
          } 

          console.log('usuario confirmado: ' + confirmacao)
          console.log('id do usuario confirmado: ' + user.uid)

          if(k !== user.uid) {
            b = true
          }

          if(k == user.uid && confirmacao === true) {
              return null
          }

          }

          if(b == true) {
            let firebaseEmail = firebase.database().ref(`usuarios/${user.uid}`)
         
        
            firebaseEmail.push('')
              firebaseEmail.set({
                confirmed: true
              })
          }
        }
      
      });
  } catch(error) {
    console.log(error)
  }
  }

  //onChange
  onTextChange = (e) => {
    this.setState({location: e.target.value}) 
    console.log('input modal: ' + this.state.location)
  } 

  sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }


  //fechar modal
  onCloseModal(modalName) {
    let e = this;
    var urlImageStorage = '';

    if(this.state.location == '' || this.state.selectedFile == null) {
      alert('Algum dos campos estão vazios!')
    } else {
        //upar imagem
        var reader = new FileReader();
        reader.onloadend = function (evt) {
          var blob = new Blob([evt.target.result], { type: "image" });

          var storageUrl = 'locais/';
          var storageRef = firebase.storage().ref(storageUrl + e.state.selectedFile.name);
          console.warn(e.state.selectedFile); // Watch Screenshot
          var uploadTask = storageRef.put(blob);

        }

        reader.onerror = function (e) {
            console.log("Failed file read: " + e.toString());
        };
        reader.readAsArrayBuffer(e.state.selectedFile);


    this.sleep(2000).then(() => { 
      console.log('url getaaddaa: '  + urlImageStorage)

      firebase.auth().onAuthStateChanged(function(user) {
          firebase.storage().ref(`locais/${e.state.selectedFile.name}`).getDownloadURL().then(function(urlLocal) {
          
            let firebaseLocal = firebase.database().ref(`usuarios/${user.uid}/locais/${e.state.location}`)
            
          firebaseLocal.push('')
              firebaseLocal.set({
                location: e.state.location,
                url: urlLocal
              })
          eventBus.addNotification('success', 'Lugar Cadastrado com Sucesso')
        })
      })


      this.setState({ [modalName]: false });
    })

    this.sleep(3000).then(() => {
      window.location.reload();
    })

  }
  }



  //mostrar modal
  onRenderModal(modalName) {
    this.setState({ [modalName]: true });
  }

  //pegar imagem do lugar
  fileSelectedHandler = event => {
    this.setState({
        selectedFile: event.target.files[0]
    })

    console.log(event.target.files[0])
  }

  render() {
    const bottomProx = <Button type='add' title='Adicionar Sensor de Proximidade' size='xs'></Button>
    const emailUsuarioAtual = this.state.emailUsuarioAtual;
    const lugaresDisponiveis = this.state.lugaresDisponiveis;


    return (
      <Page title="Controle e Informações">
        <Button type='success' title="Criar Local" icon={<i className='fa fa-plus' />} onClick={e => this.onRenderModal('customizedModal1')}/>
        <Row>
          <div style={{flexDirection: "column"}}>

          {lugaresDisponiveis.map(l => (
              <Col>
                <Panel>
                  <div style={{flexDirection: 'row'}}>
                    <Link to={{
                      pathname:'/local',
                      state:{location: l.location}
                    }}>
                      <img src={l.url} style={{borderRadius:5, width: 300, height: 200}}></img>
                    </Link>

                      <h3 style={{fontWeight: 'bold', marginTop: 5}}>{l.location}</h3>
                </div> 
                </Panel>
              </Col>
          ))}

            <Col padding={5}>
              <Panel title='Lâmpadas'  className="caixa"> 
              <div className="alinhar">
                <div className='red-text'>
                    <img style={{marginTop: 5, marginRight: 10, width: 70}} className="figura" src={lamp}></img>
                    <i>&nbsp;&nbsp;&nbsp;</i>
                    <Link to={{
                      pathname: '/listalamp',
                      state: {email: emailUsuarioAtual}
                    }}> 
                      <Button type='info' title="Ver listas de lâmpadas" size='lg' icon={<i className='fa fa-chevron-up' />} />
                    </Link>
                </div>
              </div>
              </Panel>
            </Col>

            <Col padding={5}>
              <Panel title='Sensores de Chuva'>
                <div className='red-text'>
                    <img className="figura" src="https://cdn.iconscout.com/icon/free/png-256/rainy-season-5-1126138.png"></img>
                    <i>&nbsp;&nbsp;&nbsp;</i>
                      <Link to='/chuva'>
                        <Button type='info' title="Acessar Informações" size='lg' icon={<i className='fa fa-chevron-up' />} />
                      </Link>
              </div>
              </Panel>
            </Col>

            <Col padding={5}>
              <Panel title='Sensores de Proximidade'>
                <div className='red-text'>
                    <img className="figura" src="http://www.fdlgroup.gr/wp-content/uploads/2018/01/load-sensor-brilliantile.png"></img>
                    <i>&nbsp;&nbsp;&nbsp;</i>
                      <Link to='/proximidade'>
                        <Button  type='info' title="Acessar Informações" size='lg' icon={<i className='fa fa-chevron-up' />} />
                      </Link>
              </div>
              </Panel>
            </Col>


            <Modal type='success' buttonText='Criar' title='Cadastre um sensor ou atuador' isOpen={this.state.customizedModal1} onClose={e => this.onCloseModal('customizedModal1')}>
                <Row>
                  <Col>
                    <div className='col-md-6'>
                      <Input
                        placeholder='Digite aqui o local'
                        onChange={this.onTextChange}
                        label='Digite o nome do local onde o equipamento será inserido'
                        value={this.state.location} />

                      <Input type="file" value={this.state.selectedFile} onChange={this.fileSelectedHandler}/>
                    </div>
                  </Col>
                </Row>
            </Modal>
        </div>    
        </Row>

        <Row>
        </Row>
      </Page>
    );
  }
}