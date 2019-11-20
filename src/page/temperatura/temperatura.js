import React from 'react';
import Link from 'react-router';
import { Page, Panel, Table, TableHead, TableBody, TableRow, Select } from 'react-blur-admin';
import { Row, Col } from 'react-flex-proto';
import firebase from '../../init/firebase';
import { IoIosBrush, IoIosCloseCircle } from 'react-icons/io';
import temperatura from '../../cold.png'


export class Temperatura extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      temperaturaLista:[],
      lugaresDisponiveis:[],
      idSelecionado: '',
      selectOne:''
    };
  }


  onChangeID = (e) => {
    this.setState({idSelecionado: e.target.value})
  }

  
  //SELECIONAR LUGAR
  onValueChangePlace = (e, c) => {
    firebase.auth().onAuthStateChanged(function(user) {
      firebase.database().ref(`/usuarios/${user.uid}/temperatura/${c}`).update({location: e})
    })
  }
  



  async componentDidMount() {
    let e = this;
    var lugaresDisponiveis = this.state.lugaresDisponiveis;
    var temperaturaLista = this.state.temperaturaLista;



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

      if(user == null || user == undefined) {
        console.log('entrou no if de usuario nulo')
        e.props.router.push({
          pathname: '/login'
        });
      } 
      
      let firebaseGET = firebase.database().ref(`/usuarios/${user.uid}/temperatura`)
    
        firebaseGET.on('value', (snap) => {
          var listaTemperatura = [];
      
          snap.forEach((child) => {
      
            listaTemperatura.push({
              id: child.val().id,
              location: child.val().location,
              temperatura: child.val().temperatura
            })
      
          })
      
          temperaturaLista = listaTemperatura
          e.setState({temperaturaLista: listaTemperatura})

        })
    })
       
    }
  

    deletarTemperatura(e) {
      firebase.auth().onAuthStateChanged(function(user) {
        firebase.database().ref(`/usuarios/${user.uid}/temperatura/${e}`).remove()
    })
    }

  

  render() {
    const lugaresDisponiveis = this.state.lugaresDisponiveis;
    const temperaturaLista = this.state.temperaturaLista;

    return (
      <Page  title='Dados'>
        <Panel>
          <Table>
            <TableHead>
              <th>Sensor</th>
              <th>Lugar</th>
              <th>Temperatura</th>
              <th></th>
              <th></th>
              <th></th>
              <th>Deletar</th>
            </TableHead>
            <TableBody>
              {temperaturaLista.map(a => (
                  <TableRow>
                  <td><img src={temperatura} style={{width: 50, height: 50, marginTop:5}} /></td>
                  <td>
                      <Row>
                          <Col>
                            <Select
                              placeholder={a.location}
                              value={this.state.selectOne}
                              options={lugaresDisponiveis}
                              onChange={value => this.onValueChangePlace(value, a.id)}
                              />
                          </Col>
                      </Row>  
                  </td>

                  <td>{a.temperatura}</td>
  
  
                  <td></td>
                  <td></td>
                  <td></td>

                  <td>
                    <a href='/temperatura' onClick={() => this.deletarTemperatura(a.id)}>
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
}

