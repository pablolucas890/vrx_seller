import React from 'react';
import Button from '../components/Button';
import Image from '../components/Image';
import { IView } from '../global/props';
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

  React.useEffect(() => {
    setEnviroment(localStorage.getItem('enviroment') || '');
  }, [localStorage]);

  React.useEffect(() => {
    verifyToken();
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
    window.location.href = '/home';
  }

  async function handleSetView(view: IView) {
    setViewSelected(view);
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
      <Button title='Ambientes' onClick={handleHome} active className='absolute top-2 left-5 shadow-xl text-sm p-2' />
      {views.map((view, index) => (
        <Button
          key={index}
          title={view.name}
          onClick={() => handleSetView(view)}
          active
          className='absolute top-16 shadow-xl text-sm p-2'
          style={{ left: `${index * 150}px` }}
        />
      ))}
      {viewSelected?.touchs.map((touch, index) => (
        <Image
          key={index}
          url={'../assets/img/touch.png'}
          className='absolute'
          style={{ left: `${touch.x}`, top: `${touch.y}` }}
        />
      ))}
      {enviroment && (
        <div>
          <img
            src={`../assets/img/prints/${enviroment}-${viewSelected?.id}.png`}
            alt='enviroment'
            className='h-screen w-full'
            onClick={() => {
              // TODO:
              // 1. Selecionar textura
              // 2. Se o botao de atualizar view estiver ativo, chamar rota passando a view e a textura
              // 3. Se o botao de atualizar view estiver desativado, chamar rota passando somente a view
            }}
          />
        </div>
      )}
    </>
  );
}

export default Simulation;
