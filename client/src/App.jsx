import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import About from './pages/About'
import SignIn from './pages/Signin'
import Header from './components/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/SignIn' element={<SignIn/>}/>
        <Route path='/SignUp' element={<SignUp/>}/>
        <Route path='/Profile' element={<Profile/>}/>


      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
