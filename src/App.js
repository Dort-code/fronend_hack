import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Navigation} from './components/Navigation';
import {Home} from './Home';
import {DropdownPage} from './pages/DropdownPage';
import {ModalPage} from './pages/ModalPage';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
                <header>
                    <Navigation />
                </header>
                <main className="container mx-auto px-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dropdowns" element={<DropdownPage />} />
                        <Route path="/modal" element={<ModalPage />} />
                    </Routes>
                </main>
                <footer>

                </footer>
            </div>
        </BrowserRouter>
    );
}

export default App;
