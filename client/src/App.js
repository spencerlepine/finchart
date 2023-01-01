import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Missing from './pages/Missing';

const App = () => {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="*" exact={true} element={<Missing />} />
      </Routes>
    </div>
  );
};

export default App;
