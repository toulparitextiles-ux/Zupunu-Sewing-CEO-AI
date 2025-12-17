import React, { useState } from 'react';
import Calculator from './components/Calculator';
import ChatInterface from './components/ChatInterface';
import ExportChecklist from './components/ExportChecklist';
import { AppView } from './types';
import { LayoutDashboard, Calculator as CalcIcon, MessageSquare, CheckCircle, Scissors } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case AppView.CALCULATOR:
        return <Calculator />;
      case AppView.CHAT:
        return <ChatInterface />;
      case AppView.CHECKLIST:
        return <ExportChecklist />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-industrial-900 text-slate-200 font-sans selection:bg-industrial-accent selection:text-industrial-900">
      {/* Sidebar / Navigation */}
      <nav className="fixed top-0 left-0 h-full w-20 md:w-64 bg-industrial-950 border-r border-industrial-800 flex flex-col z-10 transition-all duration-300">
        <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-industrial-800">
          <Scissors className="text-industrial-accent w-8 h-8" />
          <span className="hidden md:block ml-3 font-bold text-xl tracking-tighter text-white">ZUPUNU</span>
        </div>

        <div className="flex-1 py-8 space-y-2">
          <NavItem 
            active={currentView === AppView.DASHBOARD} 
            onClick={() => setCurrentView(AppView.DASHBOARD)} 
            icon={<LayoutDashboard />} 
            label="Главная" 
          />
          <NavItem 
            active={currentView === AppView.CALCULATOR} 
            onClick={() => setCurrentView(AppView.CALCULATOR)} 
            icon={<CalcIcon />} 
            label="Калькулятор" 
          />
          <NavItem 
            active={currentView === AppView.CHECKLIST} 
            onClick={() => setCurrentView(AppView.CHECKLIST)} 
            icon={<CheckCircle />} 
            label="Экспорт Чек-лист" 
          />
          <NavItem 
            active={currentView === AppView.CHAT} 
            onClick={() => setCurrentView(AppView.CHAT)} 
            icon={<MessageSquare />} 
            label="AI Ментор" 
          />
        </div>

        <div className="p-4 border-t border-industrial-800">
          <div className="hidden md:block text-xs text-slate-500">
            <p>Version 2.0.4 (Beta)</p>
            <p className="mt-1 text-industrial-700">Powered by Gemini</p>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pl-20 md:pl-64 pt-6 pr-6 pb-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center p-4 md:px-6 transition-all duration-200 border-r-4 ${
      active 
        ? 'bg-industrial-900 border-industrial-accent text-white' 
        : 'border-transparent text-slate-400 hover:text-white hover:bg-industrial-900/50'
    }`}
  >
    <div className={`${active ? 'text-industrial-accent' : ''}`}>{icon}</div>
    <span className="hidden md:block ml-4 font-medium">{label}</span>
  </button>
);

const Dashboard: React.FC<{ onViewChange: (view: AppView) => void }> = ({ onViewChange }) => (
  <div className="space-y-8 animate-fade-in">
    <header className="mb-8">
      <h1 className="text-4xl font-bold text-white mb-2">Производство как система</h1>
      <p className="text-slate-400 max-w-2xl text-lg">
        Хватит работать "на глаз". Управляй цифрами, оптимизируй брак, выходи на "белый" рынок.
      </p>
    </header>

    <div className="grid md:grid-cols-3 gap-6">
      <div 
        onClick={() => onViewChange(AppView.CALCULATOR)}
        className="bg-industrial-800 p-6 rounded-lg border border-industrial-700 hover:border-industrial-accent cursor-pointer transition-all hover:translate-y-[-4px] group"
      >
        <div className="w-12 h-12 bg-industrial-900 rounded flex items-center justify-center mb-4 group-hover:bg-industrial-accent transition-colors">
          <CalcIcon className="text-slate-200 group-hover:text-industrial-900" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Unit-Калькулятор</h3>
        <p className="text-slate-400 text-sm">Считаем себестоимость, логистику, налоги и чистую маржу. Узнай правду о своей прибыли.</p>
      </div>

      <div 
        onClick={() => onViewChange(AppView.CHAT)}
        className="bg-industrial-800 p-6 rounded-lg border border-industrial-700 hover:border-industrial-accent cursor-pointer transition-all hover:translate-y-[-4px] group"
      >
        <div className="w-12 h-12 bg-industrial-900 rounded flex items-center justify-center mb-4 group-hover:bg-industrial-accent transition-colors">
          <MessageSquare className="text-slate-200 group-hover:text-industrial-900" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Спросить CEO</h3>
        <p className="text-slate-400 text-sm">Жесткий разбор твоей стратегии. Что шить? Как не попасть на штрафы WB? AI-консультант.</p>
      </div>

      <div 
        onClick={() => onViewChange(AppView.CHECKLIST)}
        className="bg-industrial-800 p-6 rounded-lg border border-industrial-700 hover:border-industrial-accent cursor-pointer transition-all hover:translate-y-[-4px] group"
      >
        <div className="w-12 h-12 bg-industrial-900 rounded flex items-center justify-center mb-4 group-hover:bg-industrial-accent transition-colors">
          <CheckCircle className="text-slate-200 group-hover:text-industrial-900" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Чек-лист Экспортера</h3>
        <p className="text-slate-400 text-sm">Пошаговый план: от ИП и СТ-1 до первой отгрузки на склад в Электросталь.</p>
      </div>
    </div>

    <div className="bg-gradient-to-r from-industrial-900 to-industrial-800 border border-industrial-700 p-8 rounded-lg mt-8">
      <h2 className="text-2xl font-bold text-industrial-accent mb-4">Философия 2026</h2>
      <div className="grid md:grid-cols-2 gap-8 text-sm">
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <span className="text-industrial-accent mt-1">●</span>
            <span><strong className="text-white">Смерть Карго:</strong> Только официальный вывоз. Любая серая схема — риск конфискации.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-industrial-accent mt-1">●</span>
            <span><strong className="text-white">Сложный продукт:</strong> Базовые футболки отдали Узбекистану. Мы шьем платья, костюмы, 2-й слой.</span>
          </li>
        </ul>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <span className="text-industrial-accent mt-1">●</span>
            <span><strong className="text-white">Скорость:</strong> От идеи до склада WB — 7 дней. Долго шьешь — замораживаешь деньги.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-industrial-accent mt-1">●</span>
            <span><strong className="text-white">Цифровизация:</strong> Нет учета в цифрах = нет бизнеса.</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default App;
