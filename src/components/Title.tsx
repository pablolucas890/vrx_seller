import React from 'react';

console.log(React.version);

interface TitleProps {
  title: string;
}

export default function Title({ title }: TitleProps) {
  return <h1 className='text-2xl font-bold text-blue-450'>{title}</h1>;
}
