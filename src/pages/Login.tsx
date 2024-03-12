import React from 'react';
import Anchor from '../components/Anchor';
import Button from '../components/Button';
import Image from '../components/Image';
import Input from '../components/Input';
import SubTitle from '../components/SubTitle';
import Title from '../components/Title';

console.log(React.version);

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <div>
      <Title title='Login' />
      <SubTitle title='Por favor, isira abaixo seu usuário e senha' />
      <Input placeholder='E-mail' icon='user' value={email} onChange={e => setEmail(e.target.value)} />
      <Input
        placeholder='Senha'
        icon='lock'
        type='password'
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <Anchor title='Esqueceu a senha?' href='#' />
      <Image url='../assets/cozinha.png' href='#' />
      <Button hasIcon active={email !== '' && password !== ''} title='Entrar' />
    </div>
  );
}
