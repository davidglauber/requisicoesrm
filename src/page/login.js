import React from 'react';
import Link from 'react-router';
import { Page, Panel,Input, eventBus, Button } from 'react-blur-admin';
import logo from '../layout/logo.svg';
import firebase from '../init/firebase';

export default class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password:''
    };
  }

  async loginFirebase(){
    try {
        await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
        this.props.history.push({
          pathname:'/',
          state: {senha: this.state.password}
        })
    } catch (error) {
      alert('Usuario não encontrado :(')
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
        <div style={{alignItems: 'center'}}>
          <img style={{ textAlign: 'center' , width: 300}} src={logo}></img>
        </div>
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

          <div className='text'>
            <Button type='success' title='Entrar' onClick={() => this.loginFirebase()}></Button>

          <a style={{marginLeft: 10}} href='/cadastrar'>
            <Button type='add' title='Cadastrar'></Button>
          </a>
          </div>  

        </Panel>

      </Page>  
    );
  }
}

