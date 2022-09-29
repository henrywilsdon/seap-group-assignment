import { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import ManageAthletesPage from '../athletes/ManageAthletesPage';
import ManageCoursesPage from '../courses/ManageCoursesPage';
import SideMenu from '../navigation/SideMenu';
import HandlePredictionsPage from '../predictions/HandlePredictionsPage';
import LoginPage from '../user/LoginPage';
import ManageProfilePage from '../user/ManageProfilePage';
import RegisterPage from '../user/RegisterPage';
import UserContext from '../user/UserContext';
import './App.css';

function App() {
    const { user } = useContext(UserContext);

    return (
        <div className="app-root">
            {/* Side menu that is persistent between pages */}
            {user && <SideMenu />}

            {/* Main section of screen where pages will be displayed */}
            <main className="app-main">
                <Routes>
                    <Route path="/" element={<>Welcome</>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/athletes" element={<ManageAthletesPage />} />
                    <Route path="/courses" element={<ManageCoursesPage />} />
                    <Route path="/profile" element={<ManageProfilePage />} />
                    <Route
                        path="/predictions"
                        element={<HandlePredictionsPage />}
                    />
                </Routes>
            </main>
        </div>
    );
}

export default App;
