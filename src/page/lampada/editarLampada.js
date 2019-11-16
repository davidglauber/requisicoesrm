import React from 'react';
import { Page, Panel, Input, eventBus, Button } from 'react-blur-admin';
import { Link } from 'react-router';
import firebase from '../../init/firebase';
import { Alert } from 'react-blur-admin/dist/alert';

export class editarLampada extends React.Component {

    state = {
        location: '',
    };




async componentDidMount() {
    const location = this.props.params.location;

    this.setState({location: location})
}


onChangePlace = (e) => {
    const idLamp = this.props.params.id;
    const location = this.props.params.location;

    console.log('id da lampada: ' + idLamp)
    console.log('nome da lampada: ' + location)

    this.setState({location: e.target.value})
}

editarLampada() {
    const idLamp = this.props.params.id;
    const location = this.props.params.location;
    let e = this;


    const { history } = this.props;

        try{
          
            if(this.state.location) {

                firebase.auth().onAuthStateChanged(function(user) {
                    firebase.database().ref(`/usuarios/${user.uid}/lampadas/${idLamp}`).update({location: e.state.location});
              
                })

                eventBus.addNotification('success', 'Lâmpada Alterada com Sucesso')
                history.push('/listalamp')
            } 
            
        } catch (error){
            console.log(error)
        }
}

  render() {
    return (
        <Page title='Lâmpada'>
            <Panel title='Editar Lugar do Sensor'>

              <Input
                label='Lugar'
                placeholder='Digite o lugar onde vai usá-lo'
                onChange= {this.onChangePlace}
                value={this.state.location} />


                <Button type='add' title='Atualizar Lâmpada' onClick={() => this.editarLampada()}/>
            </Panel>
        </Page>    
            );
        }}
