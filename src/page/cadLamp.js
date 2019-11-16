import React from 'react';
import { Page, Panel, Input, eventBus, Button } from 'react-blur-admin';
import { Link } from 'react-router';
import firebase from '../init/firebase';
import { Alert } from 'react-blur-admin/dist/alert';

export class cadLamp extends React.Component {

    state = {
        nome: '',
        status: '',
    };


onChangeName = (e) => {
    this.setState({nome: e.target.value})
    alert('nomelamp: ' + this.state.nome)
}

adicionarLampada() {
    const { history } = this.props;
    //return history.push('/visitors');
    const lampada = {
        nome: this.state.nome,
        status: 'OFF'
    }

        try{
            if(this.state.nome) {
                let refLampadas = firebase.database().ref('lampadas');
                refLampadas.push(lampada);

                eventBus.addNotification('success', 'Sensor Cadastrado com Sucesso')
                history.push('/')
            } 
            
        } catch (error){
            console.log(error)
        }
}

  render() {
    return (
        <Page title='Lâmpada'>
            <Panel title='Cadastrar Sensor'>

              <Input
                label='Nome'
                placeholder='Digite o nome do seu sensor ou lugar onde vai usá-lo'
                onChange= {this.onChangeName}
                value={this.state.nome} />


                <Button type='add' title='Acidionar Lâmpada' onClick={() => this.adicionarLampada()}/>
            </Panel>
        </Page>    
            );
        }}

       /*


              <Input
                onValidate={e => true}
                label='Addon Right'
                addonRight={<i className='fa fa-check' />}
                value={this.state.addonRight}
                onChange={e => this.onTextChange('addonRight', e)} />

       <Input
                onChange={e => this.onTextChange('warning', e)}
                onValidate={e => 'warning'}
                label='Warning'
                value={this.state.warning} />

       <Input
                onChange={e => this.onTextChange('success', e)}
                onValidate={e => true}
                label='Success'
                value={this.state.success} />


                <Input
                onChange={e => this.onTextChange('fail', e)}
                onValidate={e => false}
                label='Error'
                value={this.state.fail} />*/