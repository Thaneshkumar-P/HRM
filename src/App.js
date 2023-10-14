import { Routes , Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'jquery/dist/jquery.min.js'; // Import jQuery
import 'popper.js/dist/umd/popper.min.js'; // Import Popper.js
import Landing from "./pages/Landing";
import Patient from './pages/Patient';
import Register from './pages/Register';
import Admin from './pages/Admin';
import DoctorPortal from './pages/DoctorPortal';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/Doctor" element={<DoctorPortal />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/patient" element={<Patient />} />
            <Route path="/Register" element={<Register />} />
        </Routes>
    )
}

export default App