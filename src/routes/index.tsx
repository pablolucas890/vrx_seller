import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';

console.log(React.version);

const ListRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
    </Routes>
  );
};

export default ListRoutes;
