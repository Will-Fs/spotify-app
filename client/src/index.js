import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import GetApp from './App';
import {setImageSize} from "./imageSize";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <div className='container'>
        <h1>Loading the page...</h1>
      </div>
)
GetApp(root).then( content => {
  root.render(
      <div className='container'>
        {content}
      </div>
  );
  setImageSize();
})
.then(() => {
  setImageSize();
})
