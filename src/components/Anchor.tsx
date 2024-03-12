import React from 'react';

interface AnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  title: string;
}

export default function Anchor({ title, ...rest }: AnchorProps) {
  return (
    <a {...rest} className='text-sm text-blue-500 font-bold'>
      {title}
    </a>
  );
}
