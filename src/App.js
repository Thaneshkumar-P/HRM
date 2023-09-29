import { Routes , Route } from 'react-router-dom';
import Landing from "./pages/Landing";
import Patient from './pages/Patient';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/patient" element={<Patient />} />
        </Routes>
    )
}

export default App