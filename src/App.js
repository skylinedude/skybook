import { About } from './components/About';
import { Home } from './components/Home';
import { NavBar } from './components/NavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import StateContext from './context/stateContext';
import Login from './components/Login';
import SingUp from './components/Singup';

function App() {
  return (
    <>
      <StateContext>
        <BrowserRouter>
          <NavBar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="login" element={<Login/>} />
              <Route path="signup" element={<SingUp/>} />
            </Routes>
          </div>
        </BrowserRouter>
      </StateContext>
    </>
  );
}

export default App;
