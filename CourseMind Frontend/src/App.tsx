import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Notes from './components/Notes';
import DPP from './components/DPP';
import Tests from './components/Tests';

function App() {
  const [currentSection, setCurrentSection] = useState('home');

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <Dashboard onNavigate={setCurrentSection} />;
      case 'notes':
        return <Notes />;
      case 'dpp':
        return <DPP />;
      case 'tests':
        return <Tests />;
      default:
        return <Dashboard onNavigate={setCurrentSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header currentSection={currentSection} onNavigate={setCurrentSection} />
      <main className="py-8 px-4 sm:px-6 lg:px-8 flex-1">
        {renderSection()}
      </main>
      <Footer />
    </div>
  );
}

export default App;