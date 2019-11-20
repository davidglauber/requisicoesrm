import React from 'react';
import Link from 'react-router';
import { Page, Panel, Table, TableHead, TableBody, TableRow, Select } from 'react-blur-admin';
import { Row, Col } from 'react-flex-proto';
import firebase from '../../init/firebase';
import { IoIosBrush, IoIosCloseCircle } from 'react-icons/io';
import umidade from '../../umidade.png';


export class Umidade extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      umidadeLista: [],
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
      firebase.database().ref(`/usuarios/${user.uid}/umidade/${c}`).update({location: e})
    })
  }
  



  async componentDidMount() {
    let e = this;
    var lugaresDisponiveis = this.state.lugaresDisponiveis;
    var umidadeLista = this.state.umidadeLista;



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
      
      let firebaseGET = firebase.database().ref(`/usuarios/${user.uid}/umidade`)
    
        firebaseGET.on('value', (snap) => {
          var umidade = [];
      
          snap.forEach((child) => {
      
            umidade.push({
              id: child.val().id,
              location: child.val().location,
              status: child.val().status
            })
      
          })
      
          umidadeLista = umidade
          e.setState({umidadeLista: umidade})

        })
    })
       
    }

    deletarUmidade(e) {
        firebase.auth().onAuthStateChanged(function(user) {
          firebase.database().ref(`/usuarios/${user.uid}/umidade/${e}`).remove()
      })
      }  

  render() {
    const lugaresDisponiveis = this.state.lugaresDisponiveis;
    const umidadeLista = this.state.umidadeLista;

    return (
      <Page  title='Dados'>
        <Panel>
          <Table>
            <TableHead>
              <th>Sensor</th>
              <th>Lugar</th>
              <th>Status</th>
              <th></th>
              <th></th>
              <th></th>
              <th>Deletar</th>
            </TableHead>
            <TableBody>
              {umidadeLista.map(a => (
                  <TableRow>
                  <td><img src={umidade} style={{width: 50, height: 50, marginTop:5}} /></td>
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

                  <td>{a.status}</td>
  
  
                  <td></td>
                  <td></td>
                  <td></td>

                  <td>
                    <a href='/presenca' onClick={() => this.deletarUmidade(a.id)}>
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

