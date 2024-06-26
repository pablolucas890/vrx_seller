import clsx from 'clsx';
import React from 'react';
import { IoMenu } from 'react-icons/io5';
import Button from '../components/Button';
import Image from '../components/Image';
import Input from '../components/Input';
import Loading from '../components/Loading';
import SubTitle from '../components/SubTitle';
import { ITexture, ITouch, IView } from '../global/props';
import { IoMdArrowBack } from 'react-icons/io';

import {
  API_SERVER_HOST,
  API_SERVER_PORT,
  API_SERVER_PROTOCOL,
  SKETCHUP_SERVER_HOST,
  SKETCHUP_SERVER_PORT,
  SKETCHUP_SERVER_PROTOCOL,
  STRUCTURE,
} from '../global/utils';

const environments = STRUCTURE.environments;

interface ITouchTexture {
  touchID: string;
  textureID: string;
}

export function Simulation() {
  const [enviroment, setEnviroment] = React.useState(localStorage.getItem('enviroment') || '');
  const [views, setViews] = React.useState<IView[]>([]);
  const [viewSelected, setViewSelected] = React.useState<IView>(views[0]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectViewOpen, setSelectViewOpen] = React.useState(false);
  const [touchSelected, setTouchSelected] = React.useState<ITouch>();
  const [textureSelected, setTextureSelected] = React.useState<ITexture>();
  const [textures, setTextures] = React.useState<ITexture[]>(STRUCTURE.materials.textures);
  const [localTextures, setLocalTextures] = React.useState<ITexture[]>([]);
  const [envLoading, setEnvLoading] = React.useState(true);
  const [textureLoading, setTextureLoading] = React.useState(false);
  const [imageTimestamp, setImageTimestamp] = React.useState('');
  const [touchTextures, setTouchTextures] = React.useState<ITouchTexture[]>(
    localStorage.getItem('touchTextures') ? JSON.parse(localStorage.getItem('touchTextures') || '[]') : [],
  );
  const [sync, setSync] = React.useState(localStorage.getItem('sync') ? localStorage.getItem('sync') === 'true' : true);

  React.useEffect(() => {
    check_is_open();
    checkNewMaterials();
  }, []);

  React.useEffect(() => {
    const interval = setInterval(async () => await check_is_open(), 1500);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (viewSelected?.id && !envLoading && sync) update_texture_to_seller();
  }, [viewSelected?.id, envLoading]);

  React.useEffect(() => {
    localStorage.setItem('sync', sync.toString());
  }, [sync]);

  React.useEffect(() => {
    setEnviroment(localStorage.getItem('enviroment') || '');
    setSync(localStorage.getItem('sync') == 'true');
  }, [localStorage]);

  React.useEffect(() => {
    environments.forEach(env => {
      if (env.id === enviroment) {
        setViews(env.views);
        const viewSelected = env.views.find(el => el.id === localStorage.getItem('view')) || env.views[0];
        setViewSelected(viewSelected);
        setImageTimestamp(`../assets/img/prints/${enviroment}-${viewSelected.id}.png?${Date.now()}`);
      }
    });
  }, [enviroment, environments]);

  const fetchImageTimestamp = async (imageSrc: string) => {
    try {
      const response = await fetch(imageSrc, { method: 'HEAD' });
      return response.headers.get('Last-Modified') || '';
    } catch (error) {
      console.error('Erro ao obter o timestamp da imagem:', error);
      return '';
    }
  };

  async function checkNewMaterials() {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '/';

    async function getLocalMaterials(): Promise<string[]> {
      const resLocalMaterials = await fetch(
        `${SKETCHUP_SERVER_PROTOCOL}://${SKETCHUP_SERVER_HOST}:${SKETCHUP_SERVER_PORT}/materials`,
      );
      const localMaterials: string[] = await resLocalMaterials.json();
      return localMaterials;
    }

    await fetch(`${API_SERVER_PROTOCOL}://${API_SERVER_HOST}:${API_SERVER_PORT}/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async res => {
        if (!res.ok) window.location.href = '/';
        const { materials }: { materials: string[] } = await res.json();
        let localMaterials = await getLocalMaterials();
        const newMaterials = materials.filter(el => !localMaterials.includes(el));
        newMaterials.forEach(async (material: string) => {
          await fetch(
            `${SKETCHUP_SERVER_PROTOCOL}://${SKETCHUP_SERVER_HOST}:${SKETCHUP_SERVER_PORT}/material?material=${material}`,
          );
        });
        localMaterials = await getLocalMaterials();
        setLocalTextures(
          localMaterials.map((m: string) => ({ id: m.replace('.png', ''), name: m.replace('.png', '') })),
        );
        setTextures(localMaterials.map((m: string) => ({ id: m.replace('.png', ''), name: m.replace('.png', '') })));
      })
      .catch(() => {
        localStorage.removeItem('token');
        window.location.href = '/';
      });
  }

  function handleHome() {
    localStorage.removeItem('enviroment');
    window.location.href = '/home';
  }

  function handleCancelSelect() {
    setDialogOpen(false);
    setTouchSelected(undefined);
  }

  function handleFilterTextures(filter: string) {
    if (filter === '') setTextures(localTextures);
    else {
      const filtered = localTextures.filter(texture => texture.name.toLowerCase().includes(filter.toLowerCase()));
      setTextures(filtered);
    }
  }

  async function handleTexture(texture: ITexture) {
    if (!texture || !touchSelected) return;
    setTextureLoading(true);
    const exists = touchTextures.find(el => el.touchID === touchSelected.id);
    let newTouchTextures;
    if (exists) {
      newTouchTextures = touchTextures.map(el => {
        if (el.touchID === touchSelected.id) return { touchID: el.touchID, textureID: texture.id };
        return el;
      });
    } else newTouchTextures = [...touchTextures, { touchID: touchSelected.id, textureID: texture.id }];
    setTouchTextures(newTouchTextures);
    localStorage.setItem('touchTextures', JSON.stringify(newTouchTextures));
    setTextureSelected(texture);
    await fetch(
      `${SKETCHUP_SERVER_PROTOCOL}://${SKETCHUP_SERVER_HOST}:${SKETCHUP_SERVER_PORT}/texture?texture=${texture.id}&touch=${touchSelected.id}`,
    );
    if (sync) {
      await new Promise(r => setTimeout(r, 1000));
      await update_texture_to_seller();
    }
    setTextureLoading(false);
  }

  async function handleTouch(touch: ITouch) {
    setTouchSelected(touch);
    const touchTexture = touchTextures.find(el => el.touchID === touch.id);
    if (touchTexture) {
      const texture = localTextures.find(el => el.id === touchTexture.textureID);
      setTextureSelected(texture);
    } else setTextureSelected(undefined);
  }

  async function handleView(view: IView) {
    setViewSelected(view);
    localStorage.setItem('view', view.id);
    setTouchSelected(undefined);
    setImageTimestamp(`../assets/img/prints/${enviroment}-${view?.id}.png?${Date.now()}`);
  }

  async function completeImageUpdate(enviroment: string, viewSelected: IView) {
    for (let i = 0; i < 20; i++) {
      setImageTimestamp(`../assets/img/prints/${enviroment}-${viewSelected?.id}.png?${Date.now()}`);
      await new Promise(r => setTimeout(r, 200));
    }
  }
  async function update_texture_to_seller() {
    setTextureLoading(true);
    const imageSrc = imageTimestamp;
    const oldTimeStamp = await fetchImageTimestamp(imageSrc);
    await fetch(
      `${SKETCHUP_SERVER_PROTOCOL}://${SKETCHUP_SERVER_HOST}:${SKETCHUP_SERVER_PORT}/update?project=${enviroment}&view=${viewSelected.id}`,
    );
    await waitForImageUpdate(imageSrc, oldTimeStamp);
    await new Promise(r => setTimeout(r, 2000));
    setImageTimestamp(`../assets/img/prints/${enviroment}-${viewSelected?.id}.png?${Date.now()}`);
    completeImageUpdate(enviroment, viewSelected);
    setTextureLoading(false);
  }

  async function waitForImageUpdate(imageSrc: string, oldTimestamp: string, timeout = 10000, interval = 1000) {
    const startTime = Date.now();

    return new Promise<void>(resolve => {
      const checkUpdate = async () => {
        const newTimestamp = await fetchImageTimestamp(imageSrc);
        console.log(newTimestamp, oldTimestamp);
        if (newTimestamp !== oldTimestamp) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          localStorage.setItem('view', viewSelected.id);
          window.location.href = '/simulation';
        } else {
          setTimeout(checkUpdate, interval);
        }
      };

      checkUpdate();
    });
  }

  async function check_is_open() {
    await fetch(`${SKETCHUP_SERVER_PROTOCOL}://${SKETCHUP_SERVER_HOST}:${SKETCHUP_SERVER_PORT}/is_model_open`).then(
      async res => {
        const is_model_open = await res.json();
        setEnvLoading(!is_model_open);
      },
    );
  }

  return (
    <>
      {(envLoading || textureLoading) && (
        <IoMdArrowBack
          className='absolute left-10 top-10 text-4xl text-white bg-primary-500 rounded-3xl p-1 z-50'
          onClick={handleHome}
        />
      )}
      <Loading isLoading={envLoading || textureLoading}>
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
                  onClick={() => handleView(view)}
                />
              ))}
          </dialog>
          {viewSelected?.touchs.map((touch, index) => (
            <>
              <Image
                key={index}
                url={`../assets/img/touch${touchSelected?.id === touch.id ? '_selected' : ''}.png`}
                className='absolute cursor-pointer z-20'
                style={{ left: `${touch.x}`, top: `${touch.y}` }}
                onClick={() => handleTouch(touch)}
              />
              {touchTextures.find(el => el.touchID === touch.id)?.textureID && (
                <div
                  key={index}
                  className='absolute z-20 w-20 h-16 border-1 border-secondary-600 shadow-xl rounded-xl'
                  style={{
                    left: `${parseInt(touch.x.substring(0, touch.x.length - 1)) - 1.7}%`,
                    top: `${parseInt(touch.y.substring(0, touch.y.length - 1)) + (parseInt(touch.y.substring(0, touch.y.length - 1)) > 20 ? -11 : 6)}%`,
                  }}
                >
                  <div className='w-full h-full p-2 bg-secondary-100 rounded-xl flex flex-col justify-around items-center'>
                    <img
                      src={`../assets/img/materials/${touchTextures.find(el => el.touchID === touch.id)?.textureID}.png`}
                      className='w-16 h-6 rounded-md border-2 border-gray-900'
                    />
                    <SubTitle
                      title={
                        localTextures
                          .find(el => el.id === touchTextures.find(el => el.touchID === touch.id)?.textureID)
                          ?.name?.replace(/_/g, ' ')
                          ?.substring(0, 14) || ''
                      }
                      className='text-secondary-600'
                      style={{ fontSize: '0.5rem' }}
                    />
                    {parseInt(touch.y.substring(0, touch.y.length - 1)) > 20 ? (
                      <div
                        className='absolute z-10 w-0 h-0 border-8 border-solid border-transparent border-t-secondary-100'
                        style={{ left: '40%', top: '100%' }}
                      />
                    ) : (
                      <div
                        className='absolute z-10 w-0 h-0 border-8 border-solid border-transparent border-b-secondary-100'
                        style={{ left: '40%', top: '-24%' }}
                      />
                    )}
                  </div>
                </div>
              )}
            </>
          ))}
          {enviroment && (
            <div className='flex flex-col items-center justify-center w-full h-screen'>
              <img
                src={imageTimestamp}
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
              <div className='overflow-y-auto h-[600px] w-full grid grid-cols-2 gap-4'>
                {textures.map((texture, index) => (
                  <div key={index} className='w-full mt-2 cursor-pointer'>
                    <img
                      src={`../assets/img/materials/${texture.id}.png`}
                      className={clsx(
                        'rounded-md h-10 w-full border-2 ',
                        textureSelected?.id === texture.id && 'border-primary-900 shadow-xl',
                      )}
                      onClick={() => handleTexture(texture)}
                    />
                    <SubTitle title={texture.name.replace(/_/g, ' ')} className='text-center text-secondary-600' />
                  </div>
                ))}
              </div>
              <Button
                title='Sincronizar'
                className='w-full mb-2'
                active={!sync}
                onClick={async () => {
                  if (!sync) {
                    setTextureLoading(true);
                    await update_texture_to_seller();
                    setTextureLoading(false);
                  }
                }}
              />
              <div>
                <input
                  onChange={() => setSync(!sync)}
                  type='checkbox'
                  id='sync'
                  name='sync'
                  checked={sync}
                  className='mt-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <label htmlFor='sync' className='font-poopins text-sm ml-2'>
                  Sincronizar todas as mudancas
                </label>
              </div>
            </div>
          )}
        </div>
      </Loading>
    </>
  );
}

export default Simulation;
