import React from 'react';
import Anchor from '../components/Anchor';
import Button from '../components/Button';
import Input from '../components/Input';
import SubTitle from '../components/SubTitle';
import Title from '../components/Title';
import { API_SERVER_HOST, API_SERVER_PORT, API_SERVER_PROTOCOL } from '../global/utils';

interface ILoginResponse {
  message: string;
  token?: string;
}

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [forgotPassword, setForgotPassword] = React.useState(false);

  const login_image = '../assets/img/login_image.png';
  const logologin = '../assets/img/logologin.png';

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== '') window.location.href = '/home';
  }, []);

  async function handleLogin() {
    if (forgotPassword && email !== '') {
      await fetch(`${API_SERVER_PROTOCOL}://${API_SERVER_HOST}:${API_SERVER_PORT}/forgot/${email}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(async res => {
          if (res.ok) {
            alert('Nosso time de suporte entrará em contato');
            window.location.href = '/';
          } else alert('Erro interno do servidor');
        })
        .catch(() => {
          alert('Erro interno do servidor');
        });
    }
    if (!email || !password) return;

    await fetch(`${API_SERVER_PROTOCOL}://${API_SERVER_HOST}:${API_SERVER_PORT}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(async res => {
        if (res.ok) {
          const { token }: ILoginResponse = await res.json();
          if (token) {
            alert('Login realizado com sucesso');
            localStorage.setItem('token', token);
            window.location.href = '/home';
          } else alert('Erro ao realizar login');
        } else alert('Erro ao realizar login');
      })
      .catch(() => {
        alert('Erro ao realizar login');
      });
  }

  return (
    <div className='flex'>
      <div
        className='md:w-2/4 h-screen items-center justify-center flex'
        style={{
          backgroundImage: `url(${login_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <img src={logologin} alt='logo' className='w-1/2 animate-pulse' />
      </div>
      <div className='md:w-2/4 sm:w-full h-screen items-center justify-center flex'>
        <div className='gap-4'>
          <Title title={forgotPassword ? 'Esqueceu a senha?' : 'Login'} className='mb-2' />
          <SubTitle title='Por favor, insira abaixo seu e-mail' className='mb-4' />
          <Input
            placeholder='E-mail'
            active={email != ''}
            icon='user'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='mb-4 w-[300px]'
          />
          {!forgotPassword && (
            <Input
              placeholder='Senha'
              active={password !== ''}
              icon='lock'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='mb-6 w-[300px]'
            />
          )}
          <Button
            onClick={handleLogin}
            hasIcon
            active={forgotPassword ? email !== '' : email !== '' && password !== ''}
            title={forgotPassword ? 'Recuperar' : 'Entrar'}
            className='float-right mb-6'
          />
          <div className='flex float-right'>
            <SubTitle title={'Esqueceu sua senha?'} className='mr-2' />
            <Anchor
              title={forgotPassword ? 'Voltar para o Login' : 'Clique Aqui'}
              onClick={() => setForgotPassword(!forgotPassword)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
