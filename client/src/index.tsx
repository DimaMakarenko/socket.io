import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SocketContextComponent from './context/Socket/Component';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <SocketContextComponent>
    <App />
  </SocketContextComponent>
);
