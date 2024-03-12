import React from 'react';
import { MdNavigateNext } from 'react-icons/md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  hasIcon?: boolean;
  active?: boolean;
}

export default function Button({ hasIcon, active, ...rest }: ButtonProps) {
  return (
    <div className='relative'>
      <button
        {...rest}
        className={`bg-${active ? 'blue-500' : 'blue-300'} text-white font-poopins p-3 rounded-md border-0 w-200 flex justify-center items-center`}
      >
        <p className='font-bold'>Entrar</p>
        {hasIcon && <MdNavigateNext className='text-white top-4 left-4 text-3xl ml-5' />}
      </button>
    </div>
  );
}
