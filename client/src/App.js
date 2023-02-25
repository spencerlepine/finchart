import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Missing from './pages/Missing';
import Reports from './pages/Reports';
import SpreadsheetEdit from './pages/SpreadsheetEdit';
import ViewReport from './pages/ViewReport';
import Compare from './pages/Compare';
import Import from './pages/Import';
import Settings from './pages/Settings';
import Logout from './pages/Logout';
import Login from './pages/Login';

const App = () => {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/dashboard" element={<Home />} />
        <Route exact path="/reports" element={<Reports />} />
        <Route path="/reports/:reportId" element={<ViewReport />} />
        <Route path="/reports/:reportId/:formPageId" element={<SpreadsheetEdit />} />
        <Route exact path="/compare" element={<Compare />} />
        <Route exact path="/import" element={<Import />} />
        <Route exact path="/settings" element={<Settings />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/logout" element={<Logout />} />
        <Route path="*" exact={true} element={<Missing />} />
      </Routes>
    </div>
  );
};

export default App;
