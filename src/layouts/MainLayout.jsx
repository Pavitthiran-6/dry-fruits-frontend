import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
