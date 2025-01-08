import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'


function App() {

  return (
    <div className='App'>
      <BrowserRouter>
      <Routes>
        <Route path='/' Component={HomePage}/>
        <Route path='/chats' Component={ChatPage}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
