import ReactDOM from 'react-dom/client'
import App from './App/App.tsx'
import './style.css'
import { BrowserRouter } from 'react-router-dom'
// import { HashRouter as BrowserRouter } from 'react-router-dom'
import { GameContextProvider } from './context/GameContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <GameContextProvider>
      {/* <React.StrictMode> */}
        <App />
      {/* </React.StrictMode> */}
    </GameContextProvider>
  </BrowserRouter>
)
