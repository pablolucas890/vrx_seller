import clsx from 'clsx';
import React from 'react';
import { Spinner } from 'react-activity';
import 'react-activity/dist/library.css';

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  isLoading?: boolean;
}

export default function Loading({ isLoading, children, ...rest }: LoadingProps) {
  const { className, ...props } = rest;
  return (
    <>
      <div
        {...props}
        className={clsx(
          'absolute h-screen w-full flex items-center justify-center',
          isLoading ? 'z-40' : 'z-0',
          className,
        )}
      >
        {isLoading && (
          <Spinner className={clsx('left-0 bottom-0 text-primary-500 z-40', isLoading ? 'z-40' : 'z-0')} size={50} />
        )}
      </div>
      <div className={isLoading ? 'blur-lg' : ''}>{children}</div>
    </>
  );
}
