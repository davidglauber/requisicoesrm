import React from 'react';
import Link from 'react-router';
import { Page, Panel, Table, TableHead, TableBody, TableRow, Button, Select } from 'react-blur-admin';
import { Row, Col } from 'react-flex-proto';
import firebase from '../../init/firebase';
import lamp from '../../lamp.png';
import lampOff from '../../lampOFF.png';
import '../estilo.css';
import { IoIosBrush, IoIosCloseCircle } from 'react-icons/io';

export class ListaLamp extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      lampadasDisponiveis: [],
      lugaresDisponiveis: [],
      idSelecionado: '',
      emailParam:'',
      selectOne: ''
    };
  }


  onChangeID = (e) => {
    this.setState({idSelecionado: e.target.value})
}

  setEmail(e) {
    this.setState({emailParam: e})
  }

 
  async componentDidMount() {
    let e = this;
    var lampadasDisponiveis = this.state.lampadasDisponiveis
    var lugaresDisponiveis = this.state.lugaresDisponiveis;

    //pegar locais
    await firebase.auth().onAuthStateChanged(function(user) {
      let firebaseGET = firebase.database().ref(`/usuarios/${user.uid}/locais`)
  
      firebaseGET.on('value', (snap) => {
        var lugares = [];

        snap.forEach((child) => {
          lugares.push({
            value: child.val().location,
            label:  <div><img style={{borderRadius: 10}}  src={child.val().url} height="30px" width="30px"/><b style={{borderLef:10}}>{child.val().location}</b></div>
          })
        })

        lugaresDisponiveis = lugares
        e.setState({lugaresDisponiveis: lugares})
        console.log('lista de locais: '  + lugaresDisponiveis)
      })

  })

    firebase.auth().onAuthStateChanged(function(user) {
      let firebaseGET = firebase.database().ref(`/usuarios/${user.uid}/lampadas`)
  
      firebaseGET.on('value', (snap) => {
        var lamps = [];

        snap.forEach((child) => {

          lamps.push({
            id: child.val().id,
            location: child.val().location,
            status: child.val().status
          })

        })

        lampadasDisponiveis = lamps
        e.setState({lampadasDisponiveis: lamps})
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

//SELECIONAR LUGAR
onValueChangePlace = (e, c) => {
  firebase.auth().onAuthStateChanged(function(user) {
    firebase.database().ref(`/usuarios/${user.uid}/lampadas/${c}`).update({location: e})
})
  
  console.log('select one: ' + e)
  console.log('id one: ' + c)
  this.setState({selectOne: e.target.value})
}


  render() {
    const lampadasDisponiveis = this.state.lampadasDisponiveis;
    const lugaresDisponiveis = this.state.lugaresDisponiveis;


    return (
      <Page  title='Dados'>
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

      </Page>  
    );
  }
}

