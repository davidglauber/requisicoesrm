import React from 'react';
import Link from 'react-router';
import { Page, Panel, Table, TableHead, TableBody, TableRow, Button, Select } from 'react-blur-admin';
import { Row, Col } from 'react-flex-proto';
import firebase from '../../init/firebase';
import lamp from '../../lamp.png';
import agua from '../../drop.png';
import lampOff from '../../lampOFF.png';
import '../estilo.css';
import { IoIosBrush, IoIosCloseCircle } from 'react-icons/io';

export class Local extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      lampadasDisponiveis: [],
      sensoresDeAguaDisponiveis: [],
      lugaresDisponiveis: [],
      idSelecionado: '',
      emailParam:'',
      location: this.props.location.state.location,
      selectOne: '',
      selectOne2:''
    };
  }


  onChangeID = (e) => {
    this.setState({idSelecionado: e.target.value})
}

  setEmail(e) {
    this.setState({emailParam: e})
  }

 
  async componentDidMount() {
    const location = this.state.location;

    var lampadasDisponiveis = this.state.lampadasDisponiveis;
    var lugaresDisponiveis = this.state.lugaresDisponiveis;
    var sensoresDeAguaDisponiveis = this.state.sensoresDeAguaDisponiveis;

    let e = this;


    console.log('localizacao parametro: ' + this.state.location)
    //pegar locais
    await firebase.auth().onAuthStateChanged(function(user) {
      let firebaseGET = firebase.database().ref(`/usuarios/${user.uid}/locais`)
  
      firebaseGET.on('value', (snap) => {
        var lugares = [];

        snap.forEach((child) => {
            lugares.push({
              value: child.val().location,
              label:  <div><img style={{borderRadius: 10}} src={child.val().url} height="30px" width="30px"/><b style={{borderLef:10}}>{child.val().location}</b></div>
            })
        })

        lugaresDisponiveis = lugares
        e.setState({lugaresDisponiveis: lugares})
        console.log('lista de locais: '  + lugaresDisponiveis)
      })

  })

    //lampadas 
    firebase.auth().onAuthStateChanged(function(user) {
      let firebaseGET = firebase.database().ref(`/usuarios/${user.uid}/lampadas`)
  
      firebaseGET.on('value', (snap) => {
        var lamps = [];

        snap.forEach((child) => {

          if(e.state.location == child.val().location) {
              lamps.push({
                id: child.val().id,
                location: child.val().location,
                status: child.val().status
              })
          } else {
            return null
          }

        })

        lampadasDisponiveis = lamps
        e.setState({lampadasDisponiveis: lamps})
      })


  })


  //sensores de agua
  firebase.auth().onAuthStateChanged(function(user) {
    let firebaseGET = firebase.database().ref(`/usuarios/${user.uid}/agua`)

    firebaseGET.on('value', (snap) => {
      var agua = [];

      snap.forEach((child) => {

        if(e.state.location == child.val().location) {
            agua.push({
              id: child.val().id,
              location: child.val().location,
              porcetagem: child.val().porcetagem
            })
        } else {
          return null
        }

      })

      sensoresDeAguaDisponiveis = agua
      e.setState({sensoresDeAguaDisponiveis: agua})
    })


})


  }




  ligarLampada(e) {
    const lampadasDisponiveis = this.state.lampadasDisponiveis;
    firebase.auth().onAuthStateChanged(function(user) {
      let email = user.email.replace('@','')
      let emailParametro = email.replace('.', '');


      firebase.database().ref(`/usuarios/${user.uid}/lampadas/${e}`).update({status: 'ON'})

  })

  }


  desligarLampada(e) {
    const lampadasDisponiveis = this.state.lampadasDisponiveis;
    firebase.auth().onAuthStateChanged(function(user) {
      let email = user.email.replace('@','')
      let emailParametro = email.replace('.', '');


      firebase.database().ref(`/usuarios/${user.uid}/lampadas/${e}`).update({status: 'OFF'})

  })

  }



  propsNav() {
    var emailParam = '';

    firebase.auth().onAuthStateChanged(function(user) {
            
      if (user) {
        let email = user.email.replace('@','')
        let emailParametro = email.replace('.', '');

        emailParam = emailParametro
        
      } else {
        console.log('error')
      }

      console.log('email do atual usuario nas lampadas: ' + emailParam)

    });
    this.state.lampadasDisponiveis.map(l => (
        this.props.navigation.navigate(`/editarLampada/${l.location}/${l.id}`, {
          id: l.id,
          location: l.location 
        })

    ))
    
}


deletarLampadas(e) {
  firebase.auth().onAuthStateChanged(function(user) {
    firebase.database().ref(`/usuarios/${user.uid}/lampadas/${e}`).remove()
})
}

deletarChuva(e) {
  firebase.auth().onAuthStateChanged(function(user) {
    firebase.database().ref(`/usuarios/${user.uid}/agua/${e}`).remove()
})
}

//SELECIONAR LUGAR LAMPADA
onValueChangePlace = (e, c) => {
  firebase.auth().onAuthStateChanged(function(user) {
    firebase.database().ref(`/usuarios/${user.uid}/lampadas/${c}`).update({location: e})
  })

  console.log('select one: ' + e)
  console.log('id one: ' + c)
  this.setState({selectOne: e.target.value})
}


//SELECIONAR LUGAR SENSOR DE ÁGUA
onValueChangePlaceWater = (e, c) => {
  firebase.auth().onAuthStateChanged(function(user) {
    firebase.database().ref(`/usuarios/${user.uid}/agua/${c}`).update({location: e})
  })

  console.log('select one: ' + e)
  console.log('id one: ' + c)
  this.setState({selectOne2: e.target.value})
}



  renderListOfSensors() {
    const lampadasDisponiveis = this.state.lampadasDisponiveis;
    const sensoresDeAguaDisponiveis = this.state.sensoresDeAguaDisponiveis;
    const lugaresDisponiveis = this.state.lugaresDisponiveis;
    
    return(
      <Page  title='Sensores e Atuadores'>
      <Panel className='caixa2'>
        <Table>
          <TableHead>
            <th>Lâmpada</th>
            <th>Lugar</th>
            <th>Ligar</th>
            <th>Desligar</th>
            <th></th>
            <th></th>
            <th></th>
            <th>Deletar</th>
          </TableHead>
          <TableBody>
          {lampadasDisponiveis.map(l => (
                <TableRow key={l.id}>
                    <td> 
                      {l.status === 'ON' ? 
                        <img src={lamp} style={{width: 30, height: 40, marginTop: 10,  marginBottom: 10}} />
                        : 
                        <img src={lampOff} style={{width: 30, height:40, marginTop: 10, marginBottom:10 }}/>
                      }
                    </td>
                        <td>
                              <Row>
                                  <Col>
                                    <Select
                                      placeholder={l.location}
                                      value={this.state.selectOne}
                                      options={lugaresDisponiveis}
                                      onChange={value => this.onValueChangePlace(value, l.id)}
                                      />
                                  </Col>
                              </Row>
                        </td>
                    <td><Button type='add' onClick={() => this.ligarLampada(l.id)} title='Ligar' size='xs'/></td>

                    <td><Button type='remove' onClick={() => this.desligarLampada(l.id)} title='Desligar' size='xs'/></td>


                    <td></td>
                    <td></td>
                    <td></td>

                        <td>
                          <a href='#' onClick={() => this.deletarLampadas(e)}>
                              <IoIosCloseCircle size={25} onClick={() => this.deletarLampadas(l.id)} style={{marginTop: 10}} color='#e85656'/>
                          </a>
                        </td>
                </TableRow>
          ))}
          </TableBody>
        </Table>
        <Row>
        </Row>
      </Panel>





      <Panel className='caixa2'>
        <Table>
          <TableHead>
            <th>Sensor</th>
            <th>Lugar</th>
            <th>Porcentagem de Água</th>
            <th></th>
            <th></th>
            <th></th>
            <th>Deletar</th>
          </TableHead>
          <TableBody>
          {sensoresDeAguaDisponiveis.map(l => (
                <TableRow>
                    <td> 
                        <img src={agua} style={{width: 30, height: 40, marginTop: 10,  marginBottom: 10}} />
                    </td>
                        <td>
                              <Row>
                                  <Col>
                                    <Select
                                      placeholder={l.location}
                                      value={this.state.selectOne2}
                                      options={lugaresDisponiveis}
                                      onChange={value => this.onValueChangePlaceWater(value, l.id)}
                                      />
                                  </Col>
                              </Row>
                        </td>
                    <td>{l.porcetagem + '%'}</td>

                    <td></td>
                    <td></td>
                    <td></td>

                        <td>
                          <a href='#' onClick={() => this.deletarChuva(l.id)}>
                            <IoIosCloseCircle size={25} style={{marginTop: 10, marginLeft:10}} color='#e85656'/>
                          </a>
                        </td>

                </TableRow>
          ))}
          </TableBody>
        </Table>
        <Row>
        </Row>
      </Panel>

    </Page>  

    );
  }

  render() {
    const lampadasDisponiveis = this.state.lampadasDisponiveis;
    const lugaresDisponiveis = this.state.lugaresDisponiveis;


    return (
      this.renderListOfSensors()
    );
  }
}

