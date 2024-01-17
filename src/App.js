import './App.css';
import SplashScreen from "./Auth/SplashScreen";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from "./Auth/Auth";
import CreateProfile from "./CreateProfile/CreateProfile";
import Main from "./Main/Main";



function App() {

  return (
    <div className="App" style={{fontFamily:'Open Sans'}}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SplashScreen/>}/>
                <Route path="/auth" element={<Auth />} />
                <Route path="/create-profile" element={<CreateProfile />}/>
                <Route path="/main" element={<Main/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
