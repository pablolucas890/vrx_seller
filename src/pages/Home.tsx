import clsx from 'clsx';
import React from 'react';
import Button from '../components/Button';
import Image from '../components/Image';
import Loading from '../components/Loading';
import SubTitle from '../components/SubTitle';
import Title from '../components/Title';
import {
  API_SERVER_HOST,
  API_SERVER_PORT,
  API_SERVER_PROTOCOL,
  SKETCHUP_SERVER_HOST,
  SKETCHUP_SERVER_PORT,
  SKETCHUP_SERVER_PROTOCOL,
  STRUCUTRE,
} from '../global/utils';

interface IVerifyResponse {
  message: string;
  decoded?: {
    email: string;
    iat: number;
    exp: number;
  };
}
export function Home() {
  const environments = STRUCUTRE.environments;
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    localStorage.removeItem('touchTextures');
    verifyToken();
    verifySketchup();
  }, []);

  async function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  async function handleEnv(enviroment: string) {
    setLoading(true);
    localStorage.setItem('enviroment', enviroment);
    try {
      await fetch(
        `${SKETCHUP_SERVER_PROTOCOL}://${SKETCHUP_SERVER_HOST}:${SKETCHUP_SERVER_PORT}/open_sketchup?project=${enviroment}`,
      );
      await new Promise(r => setTimeout(r, 2000));
      setLoading(false);
      window.location.href = '/simulation';
    } catch (e) {
      console.error(e);
      setLoading(false);
      window.location.href = '/';
    }
  }

  async function verifyToken() {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '/';

    await fetch(`${API_SERVER_PROTOCOL}://${API_SERVER_HOST}:${API_SERVER_PORT}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async res => {
        if (!res.ok) window.location.href = '/';
        const { decoded }: IVerifyResponse = await res.json();
        console.log(decoded);
      })
      .catch(err => {
        console.error(err);
        localStorage.removeItem('token');
        window.location.href = '/';
      });
  }

  async function verifySketchup() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 3000));
    console.log('Fechando sketchup');
    await fetch(`${SKETCHUP_SERVER_PROTOCOL}://${SKETCHUP_SERVER_HOST}:${SKETCHUP_SERVER_PORT}/close_sketchup`);
    setLoading(false);
  }

  return (
    <Loading isLoading={loading}>
      <Button title='Sair' onClick={handleLogout} active className='absolute top-5 left-10 shadow-xl' />
      <div className='flex flex-col items-center justify-center h-screen gap-4'>
        <Title title='Escolha o espaço' />
        <SubTitle title='Toque em um dos ambientes abaixo e comece a simular' />
        <div className='grid grid-cols-3 gap-4 p-4 rounded-md'>
          {environments.map((env, index) => (
            <Image
              key={env.id}
              url={`../assets/img/home_buttons/${env.id}.png`}
              onClick={() => handleEnv(env.id)}
              className={clsx(
                'z-20 cursor-pointer',
                index === environments.length - 1 && environments.length % 3 != 0 && 'col-start-2',
              )}
            />
          ))}
        </div>
      </div>
    </Loading>
  );
}

export default Home;
