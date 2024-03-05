import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from 'app/app';

import './index.scss';

const container = createRoot(document.getElementById('root'));

container.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
