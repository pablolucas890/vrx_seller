import React from 'react';
import { FaLock, FaUser } from 'react-icons/fa';

console.log(React.version);
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: 'user' | 'lock';
}

export default function Input({  icon, ...rest }: InputProps) {

  const Icon = icon === 'user' ? FaUser : FaLock;
  return (
    <div className='relative'>
      <input
        className='text-center bg-gray-100 font-poopins p-3 border-gray-300 rounded-md border-0 w-200'
        {...rest}
      />
      <Icon className='text-gray-600 absolute top-4 left-4' />
    </div>
  );
}