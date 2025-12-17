import React, { useState } from 'react';
import { CheckSquare, Square, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  critical: boolean;
}

const ExportChecklist: React.FC = () => {
  const [tasks, setTasks] = useState<{ [key: string]: boolean }>({});

  const sections: { title: string; items: Task[] }[] = [
    {
      title: "1. Юридическая база",
      items: [
        { id: "ip", text: "Открыть ИП / ОсОО", critical: true },
        { id: "bank", text: "Валютный счет (Рубли)", critical: true },
        { id: "esf", text: "Доступ к системе ЭСФ (Электронные счета-фактуры)", critical: true }
      ]
    },
    {
      title: "2. Документы на товар",
      items: [
        { id: "decl", text: "Декларация Соответствия (ЕАЭС)", critical: true },
        { id: "brand", text: "Регистрация ТЗ (или отказное письмо если NoName)", critical: false },
        { id: "st1", text: "Сертификат СТ-1 (Для 0% НДС)", critical: true }
      ]
    },
    {
      title: "3. Маркировка (Честный Знак)",
      items: [
        { id: "gs1", text: "Регистрация в GS1 Kyrgyzstan (получение GTIN)", critical: true },
        { id: "suz", text: "Заказ кодов маркировки (DataMatrix)", critical: true },
        { id: "print", text: "Печать этикеток (термотрансфер)", critical: true },
        { id: "input", text: "Ввод в оборот (отчет о нанесении)", critical: true }
      ]
    },
    {
      title: "4. Отгрузка",
      items: [
        { id: "ettn", text: "Оформление ЭТТН", critical: true },
        { id: "cargo", text: "Договор с белым перевозчиком (не карго!)", critical: true }
      ]
    }
  ];

  const toggleTask = (id: string) => {
    setTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const calculateProgress = () => {
    const total = sections.reduce((acc, sec) => acc + sec.items.length, 0);
    const checked = Object.values(tasks).filter(Boolean).length;
    return Math.round((checked / total) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-industrial-800 p-6 rounded-lg border border-industrial-700 flex justify-between items-center">
         <div>
           <h2 className="text-2xl font-bold text-white mb-2">Белый Экспорт РФ</h2>
           <p className="text-slate-400">Без этого тебя заблокируют на WB через месяц.</p>
         </div>
         <div className="text-right">
            <div className="text-4xl font-bold text-industrial-accent">{progress}%</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Готовность</div>
         </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-industrial-900 border border-industrial-700 rounded-lg p-5">
            <h3 className="text-lg font-bold text-industrial-accent mb-4 border-b border-industrial-800 pb-2">
              {section.title}
            </h3>
            <div className="space-y-3">
              {section.items.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  className="flex items-start gap-3 cursor-pointer group hover:bg-industrial-800 p-2 rounded transition-colors"
                >
                  <div className={`mt-1 ${tasks[task.id] ? 'text-industrial-success' : 'text-slate-600'}`}>
                    {tasks[task.id] ? <CheckSquare size={20} /> : <Square size={20} />}
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${tasks[task.id] ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                      {task.text}
                    </div>
                    {task.critical && !tasks[task.id] && (
                      <div className="flex items-center gap-1 text-xs text-industrial-danger mt-1">
                        <AlertCircle size={10} />
                        <span>Критично для закона</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportChecklist;
