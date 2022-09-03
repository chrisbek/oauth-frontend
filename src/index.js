import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import App from './components/App';


let appRoot = document.getElementById("app__unique__id");
let template = (
    <App/>
);
ReactDOM.render(template, appRoot);


if (module.hot) {
    // This is true only in dev env, and allows for hot module replacement
    module.hot.accept();
}