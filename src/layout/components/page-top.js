import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import { noop } from 'lodash';
import Person from 'react-blur-admin/dist/assets/img/person.svg';
import firebase from '../../init/firebase';
import {SearchBar} from 'src/layout/components/search-bar';
import sad from '../../sad.gif';

// Lib
import { IoIosBrush, IoIosCloseCircle } from 'react-icons/io';
import {MessagesAlert, MessagesAlertContainer, Modal, Input, NotificationsAlert, NotificationAlert} from 'react-blur-admin';
import {Row, Col} from 'react-flex-proto';
import { Button } from 'react-blur-admin/dist/button';

export class PageTop extends React.Component {

  static propTypes = {
    user: React.PropTypes.object,
    location: React.PropTypes.shape({
      pathname: React.PropTypes.string.isRequired,
      query: React.PropTypes.object.isRequired,
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      idObtido: '',
      email:'',
      senha:'',
      sensorAgua:[],
      lampadas:[],
      listaSensoresPresenca: [],
      listaGeral: [],
      notificationsUser: [],
      confirmacaoID: false,
      notifications: [{
        user: {
          name: 'Ashley',
          picture: Person,
        },
        subject: 'This is a notification alert',
        timeStamp: '02/13/95 9:00',
        relativeTime: moment('02/13/95').fromNow(),
      },
      {
        user: {
          name: 'Nick',
          picture: Person,
        },
        subject: 'This is a notification alert',
        timeStamp: '07/13/16 12:00',
        relativeTime: moment('07/13/16 12:00').fromNow(),
      },
      {
        user: {
          name: 'Matt',
          picture: Person,
        },
        subject: 'This is a notification alert',
        timeStamp: '04/20/15 9:00',
        relativeTime: moment('04/20/15 9:00').fromNow(),
      },
      {
        user: {
          name: 'Jon',
          picture: Person,
        },
        subject: 'This is a notification alert',
        timeStamp: '07/19/16 8:00',
        relativeTime: moment('07/19/16 8:00').fromNow(),
      },
      {
        user: {
          name: 'Jacob',
          picture: Person,
        },
        subject: 'This is a notification alert',
        timeStamp: '05/23/16 2:00',
        relativeTime: moment('05/23/16 2:00').fromNow(),
      },
      {
        user: {
          name: 'Jason',
          picture: Person,
        },
        subject: 'This is a notification alert',
        timeStamp: '05/01/16 4:00',
        relativeTime: moment('05/01/16 4:00').fromNow(),
      }],
      messages: [{
        user: {
          name: 'Ashley',
          picture: Person,
        },
        subject: 'This is a message alert',
        timeStamp: '02/13/95 9:00',
        relativeTime: moment('02/13/16').fromNow(),
      },
      {
        user: {
          name: 'Nick',
          picture: Person,
        },
        subject: 'This is a message alert',
        timeStamp: '07/13/16 12:00',
        relativeTime: moment('07/13/16 12:00').fromNow(),
      }],
    };
  }

  state = {
    isMenuOpen: false,
    appName: process.env.APP_NAME,
  }

  componentDidMount() {
    const notificationsUser = this.state.notificationsUser;
    const sensorAgua = this.state.sensorAgua;
    const lampadas = this.state.lampadas;
    const listaSensoresPresenca = this.state.listaSensoresPresenca;

    const db = firebase.database().ref('usuarios');

    let e = this;

    //verificar se ele já cadastrou o id
    db.on('value', gotData);

    function gotData(data) {
      var b = this;

      var confirmed = data.val();


    var confirmedUser = Object.keys(confirmed);

    firebase.auth().onAuthStateChanged(function(user) {

        for(var i = 0; i < confirmedUser.length; i++) {
          var k = confirmedUser[i];
          var confirmacao = confirmed[k].confirmacaoID;


          console.log('usuario confirmado: ' + confirmacao)
          console.log('id do usuario confirmado: ' + user.uid)

          if(confirmacao == true && k == user.uid) {
              e.setState({idObtido: user.uid})
              e.setState({confirmacaoID: true})
          } 
          
          if(confirmacao == undefined && k == user.uid){
              e.setState({confirmacaoID: false})
          }

        }
    })

    }

    //pegar as notificacoes do usuario
    try {
      firebase.auth().onAuthStateChanged(function(user) { 
        let firebaseGET = firebase.database().ref(`/usuarios/${user.uid}/notificacoes`)
    
        firebaseGET.on('value', (snap) => {
          var notificacoes = [];
  
          snap.forEach((child) => {
            notificacoes.push({
              id: child.val().id,
              message: child.val().message
            })
  
          })
  
          console.log(notificacoes)
          e.setState({notificationsUser: notificacoes})
  
        })  
      })

    } catch (error) {
      console.log(error)
    }

    
    //pegar lista de sensores de água
    firebase.auth().onAuthStateChanged(function(user) { 
      let firebaseGETWater = firebase.database().ref(`/usuarios/${user.uid}/agua`)
  
      firebaseGETWater.on('value', (snap) => {
        var agua = [];

        snap.forEach((child) => {
          agua.push({
            id: child.val().id,
            location: child.val().location,
            porcentagem: child.val().porcetagem
          })
        })

        e.setState({sensorAgua: agua})
        console.log(sensorAgua)
      })  
    })

    //pegar lista de lampadas
    firebase.auth().onAuthStateChanged(function(user) { 
      let firebaseGETLAMP = firebase.database().ref(`/usuarios/${user.uid}/lampadas`)
  
      firebaseGETLAMP.on('value', (snap) => {
        var lamps = [];

        snap.forEach((child) => {
          lamps.push({
            id: child.val().id,
            location: child.val().location,
            status: child.val().status
          })
        })

        e.setState({lampadas: lamps})

        console.log(lamps)
        console.log('lista geral do array: '  + sensorAgua.concat(lampadas))
      })  
      e.setState({listaGeral: sensorAgua.concat(lampadas)})

    })


    //pegar lista de sensores de presença
    firebase.auth().onAuthStateChanged(function(user) { 
      let firebaseGETLAMP = firebase.database().ref(`/usuarios/${user.uid}/presenca`)
  
      firebaseGETLAMP.on('value', (snap) => {
        var presenca = [];

        snap.forEach((child) => {
          presenca.push({
            id: child.val().id,
            location: child.val().location,
            movimento: child.val().movimento
          })
        })

        e.setState({listaSensoresPresenca: presenca})

        console.log(presenca)
        console.log('lista geral do array: '  + sensorAgua.concat(lampadas))
      })  
      e.setState({listaGeral: sensorAgua.concat(lampadas)})

    })

  }

  onToggleMenu() {
    this.setState({ isMenuOpen: ! this.state.isMenuOpen });
  }

  onLogout() {
    firebase.auth().signOut();
  }
 
  renderLogo() {
    return (
      <Link to={{ pathname: '/' }} className="al-logo clearfix">{this.state.appName}</Link>
    );
  }

  renderHamburgerMenu() {
    return null;

    // @todo
    // return (
    //   <a href className="collapse-menu-link ion-navicon" ng-click="isMenuCollapsed=!isMenuCollapsed"></a>
    // );
  }

  renderSearch() {
    return (
      <div className="search">
        <SearchBar />
      </div>
    );
  }

  onEmailChange = (e) => {
    console.log('email do modal: ' + e)
    this.setState({email: e.target.value})
  }

  onPasswordChange = (e) => {
    console.log('senha do modal: ' + e)
    this.setState({senha: e.target.value})
  }

  
  onCloseModal(modalName) {
    let e = this; 

    var senha = this.props.location.state.senha;
    console.log('senha do usuario: ' + senha)

     firebase.auth().onAuthStateChanged(function(user) { 
        if(user) {
          e.setState({idObtido: user.uid})


          console.log('entrou no receber id : ' + e.state.idObtido)

          //acessar usuario
                  if(e.state.senha == senha) {
                    firebase.auth().signInWithEmailAndPassword(e.state.email, e.state.senha);
                      alert('Usuário confirmado com sucesso!')

                      e.setState({ [modalName]: false });

                      //limpar input
                      e.setState({email: ''})
                      e.setState({senha: ''})

                      let firebaseVar = firebase.database().ref(`/usuarios/${user.uid}`)
                      
                        firebaseVar.push('')
                          firebaseVar.set({confirmacaoID: true, confirmed: true})

                        e.setState({confirmacaoID: true})

                  } else {
                    alert('Usuário não confirmado :(')
                      e.setState({ [modalName]: true });

                      //limpar input
                      e.setState({email: ''})
                      e.setState({senha: ''})
                }

        } else {
          alert('Não foi possível verificar seu usuário')
        }
    })
  }

  onCloseModalID(modalName2) {
    this.setState({ [modalName2]: false });
  }

  onCloseModalNotifications(modalName3) {
    this.setState({ [modalName3]: false });
  }

  renderButtonOrID() {
    const confirmacaoID = this.state.confirmacaoID;

    if(confirmacaoID == false) {
      return(
        <Button type='warning' title='Confirmar Conta' icon='fa fa-exclamation-triangle' onClick={e => this.onRenderModal('customizedModal1')} />
      );
    } else {
      return(
        <Button type='success' title='Meu ID' icon='fa fa-exclamation-triangle' onClick={e => this.onRenderModalID('customizedModal2')} />
      );
    }
  }

  onRenderModal(modalName) {
    var senha = this.props.location.state.senha;

    console.log('senha do usuario: ' + senha)

    this.setState({ [modalName]: true });
  }

  onRenderModalID(modalName2) {
    this.setState({ [modalName2]: true });
  }

  onRenderModalNotifications(modalName3) {
    this.setState({ [modalName3]: true });

    
  }

  renderMessages() {
    let message = _.assign({}, this.state.messages);
    return _.map(message, (messages, index) => {
      return (
        <MessagesAlert {...messages} key={index}/>
      );
    });
  }

  renderNotifications() {
    let notifications = _.assign({}, this.state.notifications);
    return _.map(notifications, (notification, index) => {
      return (
        <NotificationAlert {...notification} key={index}/>
      );
    });
  }

  deletarNotificacoes(e) {
    firebase.auth().onAuthStateChanged(function(user) {
      firebase.database().ref(`/usuarios/${user.uid}/notificacoes/${e}`).remove()
  })
  }

  showModalNotifications() {
    console.log('entrou no modal de notificacao')

    const sensorAgua = this.state.sensorAgua;
    const notificationsUser = this.state.notificationsUser;
    const lampadas = this.state.lampadas;
    const listaSensoresPresenca = this.state.listaSensoresPresenca;

    
    if(notificationsUser.length > 0) {
        return(
          <Modal type='danger' buttonText='Sair' title='Notificações Recebidas' isOpen={this.state.customizedModal3} onClose={e => this.onCloseModalNotifications('customizedModal3')}>
              <h3 style={{marginTop:10}}><b>Sensor de Chuva</b></h3>
              {notificationsUser.map(l => (
                sensorAgua.map(i => (
                  <div style={{marginTop: 10, backgroundColor:'#FBF8EF', borderRadius: 5}}>
                        <div style={{flex:1, flexDirection: 'row', alignContent:'center', alignItems:'center'}}>
                          {l.id == i.id && 
                            <div>
                                <h4 style={{marginTop: 30}}>{l.message}</h4>
                                <h4>LUGAR DO SENSOR: <b>{i.location}</b></h4>
                                <h4>ID SENSOR: <b>{i.id}</b></h4>
                                <a href='/' onClick={() => this.deletarNotificacoes(e)}>
                                        <IoIosCloseCircle size={25} onClick={() => this.deletarNotificacoes(l.id)} style={{marginTop: 10}} color='#e85656'/>
                                </a>
                            </div>
                          }
                        </div>
                </div>
                ))

              ))} 

            <h3 style={{marginTop:100}}><b>Lâmpadas</b></h3>
              {notificationsUser.map(l => (
                lampadas.map(i => (
                  <div style={{marginTop: 10, backgroundColor:'#FBF8EF', borderRadius: 5}}>
                        <div style={{flex:1, flexDirection: 'row', alignContent:'center', alignItems:'center'}}>
                          {l.id == i.id && 
                            <div>
                                <h4 style={{marginTop: 30}}>{l.message}</h4>
                                <h4>LUGAR DO SENSOR: <b>{i.location}</b></h4>
                                <h4>ID SENSOR: <b>{i.id}</b></h4>
                                <a href='/' onClick={() => this.deletarNotificacoes(e)}>
                                        <IoIosCloseCircle size={25} onClick={() => this.deletarNotificacoes(l.id)} style={{marginTop: 10}} color='#e85656'/>
                                </a>
                            </div>
                          }
                        </div>
                </div>
                ))

              ))} 



            <h3 style={{marginTop:100}}><b>Sensores de Presença</b></h3>
              {notificationsUser.map(l => (
                listaSensoresPresenca.map(i => (
                  <div style={{marginTop: 10, backgroundColor:'#FBF8EF', borderRadius: 5}}>
                        <div style={{flex:1, flexDirection: 'row', alignContent:'center', alignItems:'center'}}>
                          {l.id == i.id && 
                            <div>
                                <h4 style={{marginTop: 30}}>{l.message}</h4>
                                <h4>LUGAR DO SENSOR: <b>{i.location}</b></h4>
                                <h4>ID SENSOR: <b>{i.id}</b></h4>
                                <a href='/' onClick={() => this.deletarNotificacoes(e)}>
                                        <IoIosCloseCircle size={25} onClick={() => this.deletarNotificacoes(l.id)} style={{marginTop: 10}} color='#e85656'/>
                                </a>
                            </div>
                          }
                        </div>
                </div>
                ))

              ))} 
          </Modal>
        );
    } 
    
    if(notificationsUser.length <= 0){
      console.log('entrou no if da notificacao nula')
      return(
        <Modal type='danger' buttonText='Sair' title='Notificações Recebidas' isOpen={this.state.customizedModal3} onClose={e => this.onCloseModalNotifications('customizedModal3')}>
            <Row>
                <Col align='center'>
                    <h4>Nenhuma notificação encontrada</h4>
                    <img src={sad} style={{width: 300, height:250}}/>
                </Col>
            </Row>
        </Modal>
      );
    }

  }

  renderLengthNotifications() {
    const listaNotificationsUser = this.state.notificationsUser;
    
    if(listaNotificationsUser.length <= 1) {
        return(
          <Link onClick={e => this.onRenderModalNotifications('customizedModal3')} to="/">
                      <i className="fa fa-bell" style={{color:'red'}}> {listaNotificationsUser.length}</i>Notificação
          </Link>
        )
    } else { 
        return(
          <Link onClick={e => this.onRenderModalNotifications('customizedModal3')} to="/">
                      <i className="fa fa-bell" style={{color:'red'}}> {listaNotificationsUser.length}</i>Notificações
          </Link>
        )
    }
  }

  renderUserSection() {
    const listaNotificationsUser = this.state.notificationsUser;


    return (
      <div className="user-profile clearfix">
        <div className={`al-user-profile dropdown ${this.state.isMenuOpen ? 'open' : ''}`}>
          <a className="profile-toggle-link dropdown-toggle" onClick={this.onToggleMenu.bind(this)}>
            <img src={this.props.user && this.props.user.picture ? this.props.user.picture : Person}/>
          </a>
          <ul className="top-dropdown-menu profile-dropdown dropdown-menu">
            <li><i className="dropdown-arr"></i></li>
            <li><Link to="/"><i className="fa fa-user"></i>Profile</Link></li>
            <li>
               {this.renderLengthNotifications()}
            </li>
            <li>
                  <Link to='/login'><i onClick={() => this.onLogout()} className="fa fa-power-off"></i>Sair </Link>
            </li>
          </ul>
        </div>
        
        <Row>
          <Col padding='5px 2px'>
              {this.renderButtonOrID()}

            <Modal type='warning' buttonText='Confirmar' title='Confirmação de Email e Senha' isOpen={this.state.customizedModal1} onClose={e => this.onCloseModal('customizedModal1')}>
              <Row>
                <Col align='center'>
                  Confirme o seu email e senha para cadastrar sensores e atuadores, após isso, você receberá um identificador
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className='col-md-6'>
                    <Input
                      onChange={this.onEmailChange}
                      label='Digite seu email aqui'
                      value={this.state.email} />

                    <Input  
                      type='password'
                      onChange={this.onPasswordChange}
                      label='Digite sua senha aqui'
                      value={this.state.senha} />
                  </div>
                </Col>
              </Row>
            </Modal>

            <Modal type='success' buttonText='Fechar' title='Seu identificador (ID)' isOpen={this.state.customizedModal2} onClose={e => this.onCloseModalID('customizedModal2')}>
              <Row>
                <Col align='center'>
                 {this.state.idObtido}
                </Col>
              </Row>
            </Modal>

            {this.showModalNotifications()}
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    // dropdown - .open
    // @todo msg-center
    // onClick startSearch
    // import message cente
    return (
      <div className="page-top clearfix" scroll-position="scrolled" max-height="50">
        {this.renderLogo()}
        {this.renderHamburgerMenu()}
        {this.renderSearch()}
        {this.renderUserSection()}
      </div>
    );
  }
}
