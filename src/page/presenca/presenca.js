import React from 'react';
import Link from 'react-router';
import { Page, Panel, Table, TableHead, TableBody, TableRow, Select } from 'react-blur-admin';
import { Row, Col } from 'react-flex-proto';
import firebase from '../../init/firebase';
import { IoIosBrush, IoIosCloseCircle } from 'react-icons/io';
import presenca from '../../presenca.png';


export class Presenca extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      presencaLista:[],
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
      firebase.database().ref(`/usuarios/${user.uid}/presenca/${c}`).update({location: e})
    })
  }
  



  async componentDidMount() {
    let e = this;
    var lugaresDisponiveis = this.state.lugaresDisponiveis;
    var presencaLista = this.state.presencaLista;



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
      
      let firebaseGET = firebase.database().ref(`/usuarios/${user.uid}/presenca`)
    
        firebaseGET.on('value', (snap) => {
          var listaPresenca = [];
      
          snap.forEach((child) => {
      
            listaPresenca.push({
              id: child.val().id,
              location: child.val().location,
              movimento: child.val().movimento
            })
      
          })
      
          presencaLista = listaPresenca
          e.setState({presencaLista: listaPresenca})

        })
    })
       
    }
  

    deletarPresenca(e) {
      firebase.auth().onAuthStateChanged(function(user) {
        firebase.database().ref(`/usuarios/${user.uid}/presenca/${e}`).remove()
    })
    }

  

  render() {
    const sensoresAgua = this.state.sensoresAgua;
    const lugaresDisponiveis = this.state.lugaresDisponiveis;
    const presencaLista = this.state.presencaLista;

    return (
      <Page  title='Dados'>
        <Panel>
          <Table>
            <TableHead>
              <th>Sensor</th>
              <th>Lugar</th>
              <th>Detecção de Movimento</th>
              <th></th>
              <th></th>
              <th></th>
              <th>Deletar</th>
            </TableHead>
            <TableBody>
              {presencaLista.map(a => (
                  <TableRow>
                  <td><img src={presenca} style={{width: 50, height: 50}} /></td>
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

                  <td>{a.movimento}</td>
  
  
                  <td></td>
                  <td></td>
                  <td></td>

                  <td>
                    <a href='/presenca' onClick={() => this.deletarPresenca(a.id)}>
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

