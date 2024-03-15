import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Simulation from '../pages/Simulation';

console.log(React.version);

const ListRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/home' element={<Home />} />
      <Route path='/simulation' element={<Simulation />} />
    </Routes>
  );
};

export default ListRoutes;
