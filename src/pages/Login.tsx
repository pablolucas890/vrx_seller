import React from 'react';
import Anchor from '../components/Anchor';
import Button from '../components/Button';
import Input from '../components/Input';
import SubTitle from '../components/SubTitle';
import Title from '../components/Title';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const login_image = '../assets/login_image.png';

  async function handleLogin() {
    await fetch('http://localhost:8080/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }).then(async res => {
      if (res.ok) {
        alert('Login realizado com sucesso');
        window.location.href = '/home';
        // TODO: Implement jwt token
      } else {
        alert('Erro ao realizar login');
      }
    });
  }

  return (
    <div className='flex'>
      <div
        className='md:w-2/4 h-screen'
        style={{
          backgroundImage: `url(${login_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className='md:w-2/4 sm:w-full h-screen items-center justify-center flex'>
        <div className='gap-4'>
          <Title title='Login' className='mb-2' />
          <SubTitle title='Por favor, isira abaixo seu usuário e senha' className='mb-4' />
          <Input
            placeholder='E-mail'
            active={email != ''}
            icon='user'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='mb-4'
          />
          <Input
            placeholder='Senha'
            active={password !== ''}
            icon='lock'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='mb-6'
          />
          <Button
            onClick={handleLogin}
            hasIcon
            active={email !== '' && password !== ''}
            title='Entrar'
            className='float-right mb-6'
          />
          <div className='flex float-right'>
            <SubTitle title='Esqueceu sua senha?' className='mr-2' />
            <Anchor title='Clique Aqui' href='#' />
          </div>
        </div>
      </div>
    </div>
  );
}
