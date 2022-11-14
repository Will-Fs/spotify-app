import React from 'react';
import './styles/index.css';
import ReactDOM from 'react-dom/client';
import GetApp from './App';
import { setImageSize } from './imageSize';
import { scrollStyles } from './scrollStyles';
import { NavBar } from './components/NavBar';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <content>
    <h1>Loading the page...</h1>
  </content>
);
GetApp(root)
  .then((content) => {
    root.render(
      <content>
        <NavBar />
        {content}
      </content>
    );
    setImageSize();
  })
  .then(() => {
    setImageSize();
  });

document.onscroll = scrollStyles;
