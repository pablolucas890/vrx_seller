import clsx from 'clsx';
import React from 'react';
import { IoMenu } from 'react-icons/io5';
import Button from '../components/Button';
import Image from '../components/Image';
import Input from '../components/Input';
import SubTitle from '../components/SubTitle';
import { ITexture, ITouch, IView } from '../global/props';
import { SERVER_HOST, SERVER_PORT, SERVER_PROTOCOL, STRUCUTRE } from '../global/utils';

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

  function handleHome() {
    localStorage.removeItem('enviroment');
    window.location.href = '/home';
  }

  async function handleUpdateGlass(type: 'client' | 'client_and_seller') {
    if (!textureSelected || !touchSelected) return;
    // TODO: Implementar loading
    if (type === 'client') {
      // TODO: passar o touchSelected e textureSelected para o servidor
    } else if (type === 'client_and_seller') {
      // TODO: passar o touchSelected, viewSelected e textureSelected para o servidor
    }
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
      .catch(() => {
        localStorage.removeItem('token');
        window.location.href = '/';
      });
  }

  return (
    <div className='flex'>
      <IoMenu
        className='absolute left-10 top-10 text-4xl text-white bg-primary-500 rounded-3xl p-1'
        onClick={() => setDialogOpen(!dialogOpen)}
      />
      <dialog open={dialogOpen} className='absolute top-16 right-2/3 bg-white p-4 rounded-xl'>
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
              className={clsx('ml-4 font-bold cursor-pointer mt-4', viewSelected?.id === view.id && 'text-primary-500')}
              onClick={() => setViewSelected(view)}
            />
          ))}
      </dialog>
      {viewSelected?.touchs.map((touch, index) => (
        <Image
          key={index}
          url={`../assets/img/touch${touchSelected?.id === touch.id ? '_selected' : ''}.png`}
          className='absolute cursor-pointer'
          style={{ left: `${touch.x}`, top: `${touch.y}` }}
          onClick={() => setTouchSelected(touch)}
        />
      ))}
      {enviroment && (
        <div className='flex'>
          <img
            src={`../assets/img/prints/${enviroment}-${viewSelected?.id}.png`}
            alt='enviroment'
            className='h-screen w-full'
            onClick={handleCancelSelect}
          />
        </div>
      )}
      {touchSelected && (
        <div className='absolute w-80 bg-white h-screen right-0 px-4 py-10 items-center flex flex-col justify-between'>
          <SubTitle title='Lista de texturas' className='font-bold cursor-pointer text-center' />
          <Input
            placeholder='Buscar...'
            className='w-full rounded-2xl'
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
            className='w-full'
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
  );
}

export default Simulation;
