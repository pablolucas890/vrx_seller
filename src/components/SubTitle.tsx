import React from 'react';

console.log(React.version);

interface SubTitleProps {
  title: string;
}

export default function SubTitle({ title }: SubTitleProps) {
  return <p className='text-sm text-blue-450'>{title}</p>;
}
