import React from 'react';
import Link from 'react-router';
import { Page, Panel, Table, TableHead, TableBody, TableRow, Pagination, Breadcrumbs } from 'react-blur-admin';
import { Row, Col } from 'react-flex-proto';
import firebase from '../../init/firebase';
import { IoIosBrush, IoIosCloseCircle } from 'react-icons/io';


export class Chuva extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      sensoresAgua: [],
      idSelecionado: ''
    };
  }


  onChangeID = (e) => {
    this.setState({idSelecionado: e.target.value})
  }



    componentDidMount() {
    let e = this;
    var sensoresAgua = this.state.sensoresAgua;
    firebase.auth().onAuthStateChanged(function(user) { 
      let firebaseGET = firebase.database().ref(`/usuarios/${user.uid}/agua`)
    
        firebaseGET.on('value', (snap) => {
          var aguaList = [];
      
          snap.forEach((child) => {
      
            aguaList.push({
              id: child.val().id,
              nome: child.val().nome,
              porcetagem: child.val().porcetagem
            })
      
          })
      
          sensoresAgua = aguaList
          e.setState({sensoresAgua: aguaList})

        })
    })
       
    }
  

    deletarChuva(e) {
      firebase.auth().onAuthStateChanged(function(user) {
        firebase.database().ref(`/usuarios/${user.uid}/agua/${e}`).remove()
    })
    }


    propsNav() {

      this.state.sensoresAgua.map(a => (
          this.props.navigation.navigate(`/editarSensorChuva/${a.nome}/${a.id}`, {
            id: a.id,
            nome: a.nome
          })
  
      ))
      
  }

  render() {
    const sensoresAgua = this.state.sensoresAgua;

    return (
      <Page  title='Dados'>
        <Panel>
          <Table>
            <TableHead>
              <th>Sensor</th>
              <th>Nome</th>
              <th>Porcentagem de Água</th>
              <th></th>
              <th></th>
              <th></th>
              <th>Editar</th>
              <th>Deletar</th>
            </TableHead>
            <TableBody>
              {sensoresAgua.map(a => (
                  <TableRow>
                  <td><img src="https://image.flaticon.com/icons/png/512/131/131577.png" style={{width: 50, height: 50}} /></td>
                  <td><b>{a.nome}</b></td>
                  <td>{a.porcetagem + '%'}</td>
  
  
                  <td></td>
                  <td></td>
                  <td></td>

                  <td>
                      <a href={`/editarSensorChuva/${a.nome}/${a.id}`} onClick={() => this.propsNav()}>
                            <IoIosBrush color='white' onClick={() => this.onChangeID(a.id)} size={25} style={{marginTop: 10, marginLeft: 5}}/>
                      </a>      
                  </td>

                  <td>
                    <a href='/chuva' onClick={() => this.deletarChuva(a.id)}>
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

