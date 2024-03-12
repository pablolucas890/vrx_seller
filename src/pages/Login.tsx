import React from 'react';
import Input from '../components/Input';

console.log(React.version);

export default function Login() {
  return (
    <div>
      <Input placeholder='E-mail' icon='user'/>
      <Input placeholder='Senha' icon='lock' type='password'/>
    </div>
  );
}
