import React from 'react';
import Button from '../components/Button';
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
    <div>
      <p className='font-poopins text-2xl text-center text-gray-600'>Welcome to the home page</p>
      <Button title='Logout' onClick={handleLogout} />
    </div>
  );
}

export default Home;
