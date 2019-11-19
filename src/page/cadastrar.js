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
      password:'',
      passwordCheck:''
    };
  }

 cadastrarFirebase(){
    
    if(this.state.password !== this.state.passwordCheck) {

      alert('As senhas não coincidem!')
    } else {
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
            
            alert('Você foi Cadastrado com Sucesso')
            this.props.history.push('/login')
    
    }

  }


onChangeEmail = (e) => {
  this.setState({email: e.target.value })
}

onChangePass = (e) => {
    this.setState({password: e.target.value })
}

onChangePassCheck = (e) => {
  console.log('confirmacao de senha: '  + e.target.value)
    this.setState({passwordCheck: e.target.value })
}



  render() {
    return (
      <Page>
        <Panel className='centralizar'>
        <img style={{ textAlign: 'center' , width: 300, marginLeft: 70}} src={logo}></img>
          <h6><a style={{color:'white', marginLeft: 50}}>Digite seu email e senha para se cadastrar na plataforma</a></h6>
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
          <Input
            label='Confirmação de Senha'
            placeholder='Confirme a sua senha'
            onChange= {this.onChangePassCheck}
            value={this.state.passwordCheck}
            type='password' 
          />

          <Button type='success' title='Cadastrar' onClick={() => this.cadastrarFirebase()}></Button>
        </Panel>

      </Page>  
    );
  }
}

