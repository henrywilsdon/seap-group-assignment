import { Route, Routes } from 'react-router-dom';
import ManageAthletesPage from '../athletes/ManageAthletesPage';
import ManageCoursesPage from '../courses/ManageCoursesPage';
import SideMenu from '../navigation/SideMenu';
import LoginPage from '../user/LoginPage';
import ManageProfilePage from '../user/ManageProfilePage';
import RegisterPage from '../user/RegisterPage';
import './App.css';

function App() {
    return (
        <div className="app-root">
            {/* Side menu that is persistent between pages */}
            <SideMenu />

            {/* Main section of screen where pages will be displayed */}
            <main>
                <Routes>
                    <Route path="/" element={<>Welcome</>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/athletes" element={<ManageAthletesPage />} />
                    <Route path="/courses" element={<ManageCoursesPage />} />
                    <Route path="/profile" element={<ManageProfilePage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
