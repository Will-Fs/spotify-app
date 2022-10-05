import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import GetApp from './App';
import {setImageSize} from "./imageSize";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <div className='container'>
        <h1>Loading the page...</h1>
      </div>
  </React.StrictMode>
)
GetApp(root).then( content => {
  
  root.render(
    <React.StrictMode>
      <div className='container'>
        {content}
      </div>
    </React.StrictMode>
  );
  setImageSize();
})
.then(() => {
  setImageSize();
})


// document.querySelector(".content-container").onload = displayUserInfo;

