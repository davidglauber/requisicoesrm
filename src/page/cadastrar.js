import React from 'react';
import { Page, Panel,Input, eventBus, Button } from 'react-blur-admin';
import logo from '../layout/logo.svg';
import firebase from '../init/firebase';

export default class Cadastrar extends React.Component {

  constructor() {
    super();
    this.state = {
      lampadas:[], 
      email: '',
      password:''
    };
  }

 async cadastrarFirebase(){
    
        try {
            await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
            
            eventBus.addNotification('success', 'Você foi Cadastrado com Sucesso')
            this.props.history.push('/login')
    
        } catch (error) {
          alert('O usuário já está em uso')
            console.log("Error: " + error.toString());
        }
   
  }


onChangeEmail = (e) => {
  this.setState({email: e.target.value })
}

onChangePass = (e) => {
    this.setState({password: e.target.value })
}


  render() {
    return (
      <Page>
        <Panel className='centralizar'>
        <h1><b style={{color: 'blue'}}>Auto</b>
        <b style={{color: 'yellow'}}>House_</b></h1>
        <img style={{ textAlign: 'center' , width: 500}} src={logo}></img>
          <h6><a style={{color:'white'}}>Digite seu email e senha para se cadastrar na plataforma</a></h6>
          <br/>
          <Input
            label='Email'
            placeholder='Digite o seu email'
            onChange= {this.onChangeEmail}
            value={this.state.email} 
            type='email'
          />
          <Input
            label='Senha'
            placeholder='Digite a sua senha'
            onChange= {this.onChangePass}
            value={this.state.password}
            type='password' 
          />

          <Button type='success' title='Cadastrar' onClick={() => this.cadastrarFirebase()}></Button>
        </Panel>

      </Page>  
    );
  }
}

