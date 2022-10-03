import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import GetApp from './App';
import {setImageSize} from "./imageSize";

const root = ReactDOM.createRoot(document.getElementById('root'));
GetApp().then( content => {
  root.render(
    <React.StrictMode>
      <div className='container'>
        {content}
      </div>
    </React.StrictMode>
  );
  setImageSize();
})


// document.querySelector(".content-container").onload = displayUserInfo;

