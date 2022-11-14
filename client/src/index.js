import React from 'react';
import './styles/index.css';
import ReactDOM from 'react-dom/client';
import GetApp from './App';
import { scrollStyles } from './scrollStyles';
import { NavBar } from './components/NavBar';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div className="content-container">
    <h1>Loading the page...</h1>
  </div>
);
GetApp(root).then((content) => {
  root.render(
    <div className="content-container">
      <NavBar />
      {content}
    </div>
  );
});

document.onscroll = scrollStyles;
