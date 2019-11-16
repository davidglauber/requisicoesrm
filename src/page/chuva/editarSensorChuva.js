import React from 'react';
import { Page, Panel, Input, eventBus, Button } from 'react-blur-admin';
import { Link } from 'react-router';
import firebase from '../../init/firebase';
import { Alert } from 'react-blur-admin/dist/alert';

export class editarSensorChuva extends React.Component {

    state = {
        nome: '',
    };




async componentDidMount() {
    const nomeAgua = this.props.params.nome;

    this.setState({nome: nomeAgua})
}


onChangeName = (e) => {
    const idLamp = this.props.params.id;
    const nomeLamp = this.props.params.nome;

    console.log('id da lampada: ' + idLamp)
    console.log('nome da lampada: ' + nomeLamp)

    this.setState({nome: e.target.value})
}

editarSensorChuva() {
    const idAgua = this.props.params.id;
    const nomeAgua = this.props.params.nome;
    let e = this;

    const { history } = this.props;
    //return history.push('/visitors');

        try{
            if(this.state.nome) {
                firebase.auth().onAuthStateChanged(function(user) {
                    firebase.database().ref(`/usuarios/${user.uid}/agua/${idAgua}`).update({nome: e.state.nome});
                })

                eventBus.addNotification('success', 'Sensor de Água alterado com Sucesso')
                history.push('/chuva')
            } 
            
        } catch (error){
            eventBus.addNotification('error', 'Erro ao atualizar sensor')
            console.log(error)
        }
}

  render() {
    return (
        <Page title='Sensor de Água'>
            <Panel title='Editar Nome do Sensor'>

              <Input
                label='Nome'
                placeholder='Digite o nome do seu sensor ou lugar onde vai usá-lo'
                onChange= {this.onChangeName}
                value={this.state.nome} />


                <Button type='add' title='Atualizar Sensor de Chuva' onClick={() => this.editarSensorChuva()}/>
            </Panel>
        </Page>    
            );
        }}
