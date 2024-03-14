import React from 'react';
import Button from '../components/Button';
import Image from '../components/Image';
import SubTitle from '../components/SubTitle';
import Title from '../components/Title';
import { SERVER_HOST, SERVER_PORT, SERVER_PROTOCOL } from '../global/utils';

interface IVerifyResponse {
  message: string;
  decoded?: {
    email: string;
    iat: number;
    exp: number;
  };
}
export function Home() {
  React.useEffect(() => {
    verifyToken();
  }, []);

  async function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  async function verifyToken() {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '/';

    await fetch(`${SERVER_PROTOCOL}://${SERVER_HOST}:${SERVER_PORT}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).then(async res => {
      if (!res.ok) window.location.href = '/';
      const { decoded }: IVerifyResponse = await res.json();
      // TODO: Fazer algo com o e-mail ou dados se for necessário
      console.log(decoded);
    });
  }

  return (
    <>
      <Button title='Logout' onClick={handleLogout} active className='absolute top-5 left-10' />
      <div className='flex flex-col items-center justify-center h-screen gap-4'>
        <Title title='Escolha o espaço' />
        <SubTitle title='Toque em um dos ambientes abaixo e comece a simular' />
        <div className='grid grid-cols-2 gap-4 p-4 rounded-md'>
          <Image url='../assets/enviroments/area_lazer.png' />
          <Image url='../assets/enviroments/banheiro_lavabo.png' />
          <Image url='../assets/enviroments/banheiro_social.png' />
          <Image url='../assets/enviroments/cozinha.png' />
          <Image url='../assets/enviroments/gourmet.png' />
          <Image url='../assets/enviroments/sala_estar.png' />
        </div>
      </div>
    </>
  );
}

export default Home;
