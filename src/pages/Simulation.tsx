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

const environments = STRUCUTRE.environments;

interface IVerifyResponse {
  message: string;
  decoded?: {
    email: string;
    iat: number;
    exp: number;
  };
}

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
  const [textures, setTextures] = React.useState<ITexture[]>([]);
  const [envLoading, setEnvLoading] = React.useState(true);
  const [textureLoading, setTextureLoading] = React.useState(false);
  const [imageTimestamp, setImageTimestamp] = React.useState('');
  const [touchTextures, setTouchTextures] = React.useState<ITouchTexture[]>(
    localStorage.getItem('touchTextures') ? JSON.parse(localStorage.getItem('touchTextures') || '[]') : [],
  );
  const [sync, setSync] = React.useState(
    localStorage.getItem('sync') ? localStorage.getItem('sync') === 'true' : true,
  );

  React.useEffect(() => {
    check_is_open();
    verifyToken();
    setTextures(STRUCUTRE.materials.textures);
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

  function handleHome() {
    localStorage.removeItem('enviroment');
    window.location.href = '/home';
  }

  function handleCancelSelect() {
    setDialogOpen(false);
    setTouchSelected(undefined);
  }

  function handleFilterTextures(filter: string) {
    if (filter === '') setTextures(STRUCUTRE.materials.textures);
    else {
      const filtered = STRUCUTRE.materials.textures.filter(texture =>
        texture.name.toLowerCase().includes(filter.toLowerCase()),
      );
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
      const texture = STRUCUTRE.materials.textures.find(el => el.id === touchTexture.textureID);
      setTextureSelected(texture);
    } else setTextureSelected(undefined);
  }

  async function handleView(view: IView) {
    setViewSelected(view);
    localStorage.setItem('view', view.id);
    setTouchSelected(undefined);
    setImageTimestamp(`../assets/img/prints/${enviroment}-${view?.id}.png?${Date.now()}`);
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

  async function update_texture_to_seller() {
    setTextureLoading(true);
    const imageSrc = imageTimestamp;
    const oldTimeStamp = await fetchImageTimestamp(imageSrc);
    await fetch(
      `${SKETCHUP_SERVER_PROTOCOL}://${SKETCHUP_SERVER_HOST}:${SKETCHUP_SERVER_PORT}/update?project=${enviroment}&view=${viewSelected.id}`,
    );
    await waitForImageUpdate(imageSrc, oldTimeStamp);
    await new Promise(r => setTimeout(r, 3500));
    setImageTimestamp(`../assets/img/prints/${enviroment}-${viewSelected?.id}.png?${Date.now()}`);
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
              <>
                <img
                  key={index}
                  src={`../assets/img/materials/${touchTextures.find(el => el.touchID === touch.id)?.textureID}.png`}
                  className='absolute z-20 w-10 h-10 border-2 border-black shadow-xl'
                  style={{ left: `${parseInt(touch.x.substring(0, touch.x.length - 1)) + 3}%`, top: `${touch.y}` }}
                />
                <SubTitle
                  key={index}
                  title={
                    STRUCUTRE.materials.textures.find(
                      el => el.id === touchTextures.find(el => el.touchID === touch.id)?.textureID,
                    )?.name || ''
                  }
                  className='absolute z-20 font-bold'
                  style={{
                    left: `${parseInt(touch.x.substring(0, touch.x.length - 1)) + 3}%`,
                    top: `${parseInt(touch.y.substring(0, touch.y.length - 1)) + 5}%`,
                    textShadow: '2px 2px 4px white',
                  }}
                />
              </>
            )}
          </>
        ))}
        {enviroment && (
          <div className='flex'>
            <img src={imageTimestamp} alt='enviroment' className='h-screen w-full z-10' onClick={handleCancelSelect} />
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
                    onClick={() => handleTexture(texture)}
                  />
                  <SubTitle title={texture.name} className='text-center text-secondary-600' />
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
  );
}

export default Simulation;
