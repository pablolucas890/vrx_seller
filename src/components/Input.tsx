import clsx from 'clsx';
import React from 'react';
import { FaLock, FaUser } from 'react-icons/fa';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: 'user' | 'lock';
  active?: boolean;
}

export default function Input({ icon, active, ...rest }: InputProps) {
  const Icon = icon === 'user' ? FaUser : FaLock;
  const { className, ...props } = rest;

  return (
    <div className='relative'>
      <input
        className={clsx(
          'text-center bg-gray-100 font-poopins p-3 border-gray-300 rounded-md border-0 w-200',
          active ? 'text-blue-450' : 'text-gray-300',
          className,
        )}
        {...props}
      />
      <Icon className={clsx('absolute top-4 left-4', active ? 'text-blue-450' : 'text-gray-300')} />
    </div>
  );
}
