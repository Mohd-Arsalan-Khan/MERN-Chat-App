import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import ChatProvider from './context/chatProvider'


function App() {

  return (
    <div className='App'>
      <BrowserRouter>
      <ChatProvider>
      <Routes>
        <Route path='/' Component={HomePage}/>
        <Route path='/chats' Component={ChatPage}/>
      </Routes>
      </ChatProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
