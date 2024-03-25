import clsx from 'clsx';
import React from 'react';
import { IoMenu } from 'react-icons/io5';
import Button from '../components/Button';
import Image from '../components/Image';
import Input from '../components/Input';
import Loading from '../components/Loading';
import SubTitle from '../components/SubTitle';
import { ITexture, ITouch, IView } from '../global/props';
import {
  API_SERVER_HOST,
  API_SERVER_PORT,
  API_SERVER_PROTOCOL,
  SKETCHUP_SERVER_HOST,
  SKETCHUP_SERVER_PORT,
  SKETCHUP_SERVER_PROTOCOL,
  STRUCUTRE,
} from '../global/utils';

const enviroments = STRUCUTRE.enviroments;

interface IVerifyResponse {
  message: string;
  decoded?: {
    email: string;
    iat: number;
    exp: number;
  };
}

export function Simulation() {
  const [enviroment, setEnviroment] = React.useState(localStorage.getItem('enviroment') || '');
  const [views, setViews] = React.useState<IView[]>([]);
  const [viewSelected, setViewSelected] = React.useState<IView>(views[0]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectViewOpen, setSelectViewOpen] = React.useState(false);
  const [touchSelected, setTouchSelected] = React.useState<ITouch>();
  const [textureSelected, setTextureSelected] = React.useState<ITexture>();
  const [textures, setTextures] = React.useState<ITexture[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [imageTimestamp, setImageTimestamp] = React.useState(Date.now());

  // TODO: Ficar pingando no sketchup para verificar se ele esta aberto
  React.useEffect(() => {
    const interval = setInterval(() => {
      setImageTimestamp(Date.now());
    }, 1000);

    return () => clearInterval(interval); // Limpa o intervalo
  }, []);

  React.useEffect(() => {
    setEnviroment(localStorage.getItem('enviroment') || '');
  }, [localStorage]);

  React.useEffect(() => {
    verifyToken();
    setTextures(STRUCUTRE.materials.textures);
  }, []);

  React.useEffect(() => {
    enviroments.forEach(env => {
      if (env.id === enviroment) {
        setViews(env.views);
        setViewSelected(env.views[0]);
      }
    });
  }, [enviroment, enviroments]);

  async function handleHome() {
    localStorage.removeItem('enviroment');
    await fetch(`${SKETCHUP_SERVER_PROTOCOL}://${SKETCHUP_SERVER_HOST}:${SKETCHUP_SERVER_PORT}/close_sketchup`);
    window.location.href = '/home';
  }

  async function handleUpdateGlass(type: 'client' | 'client_and_seller') {
    if (type === 'client') {
      if (!textureSelected || !touchSelected) return;
      setLoading(true);
      await fetch(
        `${SKETCHUP_SERVER_PROTOCOL}://${SKETCHUP_SERVER_HOST}:${SKETCHUP_SERVER_PORT}/texture?texture=${textureSelected.id}&touch=${touchSelected.id}`,
      );
      await new Promise(r => setTimeout(r, 200));
    } else if (type === 'client_and_seller') {
      // TODO: Fechar o loading quando a imagem for alterada
      setLoading(true);
      await fetch(
        `${SKETCHUP_SERVER_PROTOCOL}://${SKETCHUP_SERVER_HOST}:${SKETCHUP_SERVER_PORT}/update?project=${enviroment}&view=${viewSelected.id}`,
      );
      await new Promise(r => setTimeout(r, 10000));
    }
    setLoading(false);
  }

  function handleCancelSelect() {
    setDialogOpen(false);
    setTouchSelected(undefined);
  }

  async function handleFilterTextures(filter: string) {
    if (filter === '') setTextures(STRUCUTRE.materials.textures);
    else {
      const filtered = STRUCUTRE.materials.textures.filter(texture =>
        texture.name.toLowerCase().includes(filter.toLowerCase()),
      );
      setTextures(filtered);
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
      .catch(() => {
        localStorage.removeItem('token');
        window.location.href = '/';
      });
  }
  return (
    <Loading isLoading={loading}>
      <div className='flex'>
        <IoMenu
          className='absolute left-10 top-10 text-4xl text-white bg-primary-500 rounded-3xl p-1 z-20'
          onClick={() => setDialogOpen(!dialogOpen)}
        />
        <dialog open={dialogOpen} className='absolute top-16 right-2/3 bg-white p-4 rounded-xl z-30'>
          <SubTitle title='Escolher outra área' className='font-bold cursor-pointer mb-4' onClick={handleHome} />
          <SubTitle
            title='Mudar posição da área atual ▼'
            className='font-bold cursor-pointer'
            onClick={() => setSelectViewOpen(!selectViewOpen)}
          />
          {selectViewOpen &&
            views.map((view, index) => (
              <SubTitle
                key={index}
                title={`► ${view.name}`}
                className={clsx(
                  'ml-4 font-bold cursor-pointer mt-4',
                  viewSelected?.id === view.id && 'text-primary-500',
                )}
                onClick={() => setViewSelected(view)}
              />
            ))}
        </dialog>
        {viewSelected?.touchs.map((touch, index) => (
          <Image
            key={index}
            url={`../assets/img/touch${touchSelected?.id === touch.id ? '_selected' : ''}.png`}
            className='absolute cursor-pointer z-20'
            style={{ left: `${touch.x}`, top: `${touch.y}` }}
            onClick={() => setTouchSelected(touch)}
          />
        ))}
        {enviroment && (
          <div className='flex'>
            <img
              src={`../assets/img/prints/${enviroment}-${viewSelected?.id}.png?${imageTimestamp}`}
              alt='enviroment'
              className='h-screen w-full z-10'
              onClick={handleCancelSelect}
            />
          </div>
        )}
        {touchSelected && (
          <div className='absolute w-80 bg-white h-screen right-0 px-4 py-10 items-center flex flex-col justify-between z-20'>
            <SubTitle title='Lista de texturas' className='font-bold cursor-pointer text-center mb-4' />
            <Input
              placeholder='Buscar...'
              className='w-full rounded-2xl mb-4'
              onChange={e => handleFilterTextures(e.target.value)}
            />
            <div className='overflow-y-auto h-[600px] w-full'>
              {textures.map((texture, index) => (
                <div key={index} className='w-full mt-2 cursor-pointer'>
                  <img
                    src={`../assets/img/materials/${texture.id}.png`}
                    className={clsx(
                      'rounded-md h-10 w-full border-2 ',
                      textureSelected?.id === texture.id && 'border-primary-500',
                    )}
                    onClick={() => setTextureSelected(texture)}
                  />
                  <SubTitle title={texture.name} className='text-center text-secondary-600' />
                </div>
              ))}
            </div>
            <Button
              title='Aplicar'
              className='w-full mb-4'
              active={textureSelected != undefined}
              onClick={() => handleUpdateGlass('client')}
            />
            <SubTitle
              title='Aplicar no Editor'
              className='font-bold cursor-pointer'
              onClick={() => handleUpdateGlass('client_and_seller')}
            />
          </div>
        )}
      </div>
    </Loading>
  );
}

export default Simulation;
