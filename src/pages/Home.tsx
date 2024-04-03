import clsx from 'clsx';
import React from 'react';
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
  STRUCTURE,
} from '../global/utils';
import { IoMenu } from 'react-icons/io5';

interface IVerifyResponse {
  message: string;
  decoded?: {
    email: string;
    iat: number;
    exp: number;
  };
}
export function Home() {
  const environments = STRUCTURE.environments;
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);

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

  async function handleUpload() {
    const fileInput = document.getElementById('file') as HTMLInputElement;
    fileInput.click();
  }

  async function handleSaveTexture(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return console.error('Arquivo não encontrado');

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    fetch(`${SKETCHUP_SERVER_PROTOCOL}://${SKETCHUP_SERVER_HOST}:${SKETCHUP_SERVER_PORT}/upload_texture`, {
      method: 'POST',
      body: formData,
    })
      .then(async res => await res.json())
      .then(res => (res ? alert('Textura adicionada com sucesso') : alert('Erro ao adicionar textura')))
      .catch(err => console.error(err));
  }
  async function verifyToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('token');
      await new Promise(r => setTimeout(r, 2000));
      window.location.href = '/';
    }

    await fetch(`${API_SERVER_PROTOCOL}://${API_SERVER_HOST}:${API_SERVER_PORT}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async res => {
        if (!res.ok) {
          localStorage.removeItem('token');
          await new Promise(r => setTimeout(r, 2000));
          window.location.href = '/';
        }
        const { decoded }: IVerifyResponse = await res.json();
        console.log(decoded);
      })
      .catch(async err => {
        console.error(err);
        localStorage.removeItem('token');
        await new Promise(r => setTimeout(r, 2000));
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
      <IoMenu
        className='absolute left-10 top-10 text-4xl text-white bg-primary-500 rounded-3xl p-1 z-20'
        onClick={() => setDialogOpen(!dialogOpen)}
      />
      <dialog
        open={dialogOpen}
        className='absolute top-16 right-2/3 bg-secondary-100 p-4 rounded-xl z-30 border-2 border-primary-900'
      >
        <SubTitle title='Sair' className='font-bold cursor-pointer mb-4' onClick={handleLogout} />
        <SubTitle title='Adicionar Texura' className='font-bold cursor-pointer mb-4' onClick={handleUpload} />
        <input type='file' id='file' accept='.png' style={{ display: 'none' }} onChange={handleSaveTexture} />
      </dialog>
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
