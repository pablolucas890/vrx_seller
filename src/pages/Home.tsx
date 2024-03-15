import clsx from 'clsx';
import React from 'react';
import Button from '../components/Button';
import Image from '../components/Image';
import SubTitle from '../components/SubTitle';
import Title from '../components/Title';
import { SERVER_HOST, SERVER_PORT, SERVER_PROTOCOL, STRUCUTRE } from '../global/utils';

interface IVerifyResponse {
  message: string;
  decoded?: {
    email: string;
    iat: number;
    exp: number;
  };
}
export function Home() {
  const enviroments = STRUCUTRE.enviroments;

  React.useEffect(() => {
    verifyToken();
  }, []);

  async function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  async function handleEnv(enviroment: string) {
    localStorage.setItem('enviroment', enviroment);
    // TODO: Abrir o sketchup, colocar um loading e esperar um tempo antes de abrir a tela de simulação
    window.location.href = '/simulation';
  }

  async function verifyToken() {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '/';

    await fetch(`${SERVER_PROTOCOL}://${SERVER_HOST}:${SERVER_PORT}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async res => {
        if (!res.ok) window.location.href = '/';
        const { decoded }: IVerifyResponse = await res.json();
        // TODO: Fazer algo com o e-mail ou dados se for necessário
        console.log(decoded);
      })
      .catch(err => {
        console.error(err);
        localStorage.removeItem('token');
        window.location.href = '/';
      });
  }

  return (
    <>
      {/* TODO: Fazer botao de Upload textura se necessário*/}
      <Button title='Sair' onClick={handleLogout} active className='absolute top-5 left-10 shadow-xl' />
      <div className='flex flex-col items-center justify-center h-screen gap-4'>
        <Title title='Escolha o espaço' />
        <SubTitle title='Toque em um dos ambientes abaixo e comece a simular' />
        <div className='grid grid-cols-3 gap-4 p-4 rounded-md'>
          {enviroments.map((env, index) => (
            <Image
              key={env.id}
              url={`../assets/img/home_buttons/${env.id}.png`}
              onClick={() => handleEnv(env.id)}
              className={clsx(index === enviroments.length - 1 && enviroments.length % 3 != 0 && 'col-start-2')}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
