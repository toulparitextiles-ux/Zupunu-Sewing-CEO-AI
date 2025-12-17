import React, { useState, useEffect } from 'react';
import { UnitEconomicsData, CalculationResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calculator as CalcIcon, AlertTriangle, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#6366f1'];

const Calculator: React.FC = () => {
  const [data, setData] = useState<UnitEconomicsData>({
    sellingPrice: 1800,
    fabricCostSom: 350,
    fabricCostRub: 0,
    exchangeRate: 0.92,
    accessoriesCost: 50,
    laborCost: 200,
    packagingCost: 20,
    fulfillmentCost: 100,
    logisticsToClient: 80,
    marketingBudget: 150,
    taxRate: 6,
    buyoutPercent: 85
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculate = () => {
    // 1. Calculate Marketplace Commission (Assume roughly 25% for WB for simplicity, or allow input)
    const commissionRate = 0.25;
    const commission = data.sellingPrice * commissionRate;

    // 2. Adjust logistics for buyout rate (Real Unit Economics)
    // Formula: To sell 1 unit with Buyout B, you ship 1/B times.
    // You pay Forward Logistics (1/B) times.
    // You pay Return Logistics (1/B - 1) times.
    const buyoutRate = Math.max(data.buyoutPercent, 1) / 100; // avoid div by zero
    const deliveriesPerSale = 1 / buyoutRate; // e.g. 30% buyout -> 3.33 deliveries per sale
    const returnsPerSale = deliveriesPerSale - 1; // e.g. 2.33 returns per sale

    // Hardcoded estimate for WB return logistics (typically 33-50 RUB). 
    // Being strict: using 50 RUB.
    const returnTariff = 50; 
    
    const logisticsLoad = (data.logisticsToClient * deliveriesPerSale) + (returnTariff * returnsPerSale);

    // 3. Tax (Indirectly calculated on revenue usually)
    const tax = data.sellingPrice * (data.taxRate / 100);

    // 4. Calculate Fabric Cost (Som -> Rub + Rub)
    // Formula: Cost in Rubles = Cost in Soms / Exchange Rate (if Rate is "How many Soms for 1 Rub")
    const fabricCostConverted = data.exchangeRate > 0 ? (data.fabricCostSom / data.exchangeRate) : 0;
    const totalFabricCost = fabricCostConverted + data.fabricCostRub;

    const cog = totalFabricCost + data.accessoriesCost + data.laborCost + data.packagingCost;
    
    // Fulfillment (Prep + First Mile) is incurred once per unit created/sent, not per shipment attempt.
    // So it stays 1:1 roughly.
    const totalExpenses = cog + data.fulfillmentCost + logisticsLoad + data.marketingBudget + commission + tax;

    const netProfit = data.sellingPrice - totalExpenses;
    const margin = (netProfit / data.sellingPrice) * 100;
    const roi = (netProfit / cog) * 100;

    let verdict: CalculationResult['verdict'] = 'GOOD';
    if (netProfit < 0) verdict = 'SCAM';
    else if (margin < 15) verdict = 'RISKY';
    else if (margin > 30) verdict = 'GOLDMINE';

    setResult({
      totalCost: totalExpenses,
      marketplaceCommission: commission,
      logisticsExpenses: logisticsLoad,
      taxAmount: tax,
      netProfit,
      marginPercent: margin,
      roi,
      verdict
    });
  };

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const calculateFabricChartValue = () => {
    const fabricCostConverted = data.exchangeRate > 0 ? (data.fabricCostSom / data.exchangeRate) : 0;
    return fabricCostConverted + data.fabricCostRub;
  };

  const chartData = result ? [
    { name: 'Себестоимость (Сырье+Труд)', value: calculateFabricChartValue() + data.accessoriesCost + data.laborCost + data.packagingCost },
    { name: 'Комиссия МП', value: result.marketplaceCommission },
    { name: 'Логистика (ФФ+Покатушки)', value: data.fulfillmentCost + result.logisticsExpenses },
    { name: 'Реклама (ДРР)', value: data.marketingBudget },
    { name: 'Налоги', value: result.taxAmount },
  ] : [];

  return (
    <div className="bg-industrial-800 p-6 rounded-lg border border-industrial-700 shadow-xl max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b border-industrial-700 pb-4">
        <CalcIcon className="text-industrial-accent w-8 h-8" />
        <div>
          <h2 className="text-2xl font-bold text-slate-100 uppercase tracking-wider">Unit-Экономика</h2>
          <p className="text-slate-400 text-sm">Считаем каждый сом. Розовые очки снять.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Цена продажи (WB)</label>
              <input type="number" name="sellingPrice" value={data.sellingPrice} onChange={handleChange} className="w-full bg-industrial-900 border border-industrial-700 text-white p-2 rounded focus:border-industrial-accent outline-none font-mono" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">% Выкупа</label>
              <input type="number" name="buyoutPercent" value={data.buyoutPercent} onChange={handleChange} className="w-full bg-industrial-900 border border-industrial-700 text-white p-2 rounded focus:border-industrial-accent outline-none font-mono" />
            </div>
          </div>

          <div className="p-4 bg-industrial-900 rounded border border-industrial-700">
            <div className="flex justify-between items-center mb-3">
               <h3 className="text-industrial-accent text-sm font-bold uppercase">Производство (COGS)</h3>
               <div className="flex items-center gap-2">
                 <RefreshCcw size={12} className="text-slate-500" />
                 <label className="text-xs text-slate-500">Курс (1₽ = ?с)</label>
                 <input 
                   type="number" 
                   name="exchangeRate" 
                   value={data.exchangeRate} 
                   onChange={handleChange} 
                   step="0.01"
                   className="w-16 bg-industrial-800 text-industrial-accent font-bold p-1 rounded border border-industrial-700 text-xs text-center" 
                 />
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 grid grid-cols-2 gap-3 p-2 bg-industrial-800/50 rounded border border-industrial-800">
                 <div>
                    <label className="text-xs text-slate-400">Ткань (сом)</label>
                    <input type="number" name="fabricCostSom" value={data.fabricCostSom} onChange={handleChange} className="w-full bg-industrial-900 text-white p-1 rounded border border-industrial-700 text-sm" />
                 </div>
                 <div>
                    <label className="text-xs text-slate-400">Ткань (руб)</label>
                    <input type="number" name="fabricCostRub" value={data.fabricCostRub} onChange={handleChange} className="w-full bg-industrial-900 text-white p-1 rounded border border-industrial-700 text-sm" />
                 </div>
                 <div className="col-span-2 text-[10px] text-right text-slate-500">
                    Итого ткань: {((data.fabricCostSom / (data.exchangeRate || 1)) + data.fabricCostRub).toFixed(1)} ₽
                 </div>
              </div>

              <div>
                <label className="text-xs text-slate-500">Фурнитура (руб)</label>
                <input type="number" name="accessoriesCost" value={data.accessoriesCost} onChange={handleChange} className="w-full bg-industrial-800 text-white p-1 rounded border border-industrial-700 text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-500">Пошив (руб)</label>
                <input type="number" name="laborCost" value={data.laborCost} onChange={handleChange} className="w-full bg-industrial-800 text-white p-1 rounded border border-industrial-700 text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-500">Упаковка (руб)</label>
                <input type="number" name="packagingCost" value={data.packagingCost} onChange={handleChange} className="w-full bg-industrial-800 text-white p-1 rounded border border-industrial-700 text-sm" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-industrial-900 rounded border border-industrial-700">
            <h3 className="text-industrial-accent text-sm font-bold mb-3 uppercase">Расходы МП</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500">Фулфилмент (Преп)</label>
                <input type="number" name="fulfillmentCost" value={data.fulfillmentCost} onChange={handleChange} className="w-full bg-industrial-800 text-white p-1 rounded border border-industrial-700 text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-500">Логистика (1 конец)</label>
                <input type="number" name="logisticsToClient" value={data.logisticsToClient} onChange={handleChange} className="w-full bg-industrial-800 text-white p-1 rounded border border-industrial-700 text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-500">Реклама (на шт)</label>
                <input type="number" name="marketingBudget" value={data.marketingBudget} onChange={handleChange} className="w-full bg-industrial-800 text-white p-1 rounded border border-industrial-700 text-sm" />
              </div>
               <div>
                <label className="text-xs text-slate-500">Налог %</label>
                <input type="number" name="taxRate" value={data.taxRate} onChange={handleChange} className="w-full bg-industrial-800 text-white p-1 rounded border border-industrial-700 text-sm" />
              </div>
            </div>
            <div className="mt-2 text-[10px] text-slate-500 italic">
               * Логистика учитывает {data.buyoutPercent}% выкупа: {(100/data.buyoutPercent).toFixed(1)} доставки + {((100/data.buyoutPercent)-1).toFixed(1)} возврата на 1 продажу.
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col h-full">
           {result && (
             <>
                <div className="bg-industrial-900 p-4 rounded border border-industrial-700 mb-4 flex-grow">
                   <h3 className="text-white font-bold mb-4">Структура расходов</h3>
                   <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="text-xs text-slate-400 mt-2 space-y-1">
                      {chartData.map((entry, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span style={{color: COLORS[idx % COLORS.length]}}>{entry.name}</span>
                          <span>{entry.value.toFixed(0)} ₽</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className={`p-4 rounded border-2 ${
                  result.verdict === 'SCAM' ? 'border-industrial-danger bg-red-900/20' :
                  result.verdict === 'RISKY' ? 'border-industrial-accent bg-amber-900/20' :
                  'border-industrial-success bg-emerald-900/20'
                }`}>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-slate-300">Чистая прибыль:</span>
                       <span className={`text-2xl font-bold font-mono ${result.netProfit > 0 ? 'text-industrial-success' : 'text-industrial-danger'}`}>
                         {result.netProfit.toFixed(0)} ₽
                       </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-slate-300">Маржинальность:</span>
                       <span className="text-xl font-mono text-white">{result.marginPercent.toFixed(1)}%</span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="flex items-center gap-2 font-bold text-lg uppercase">
                         {result.verdict === 'SCAM' && <><AlertTriangle className="text-red-500"/> <span className="text-red-500">Ты работаешь в минус!</span></>}
                         {result.verdict === 'RISKY' && <><TrendingDown className="text-amber-500"/> <span className="text-amber-500">Рискованно (Маржа &lt; 20%)</span></>}
                         {(result.verdict === 'GOOD' || result.verdict === 'GOLDMINE') && <><TrendingUp className="text-emerald-500"/> <span className="text-emerald-500">Можно шить</span></>}
                      </div>
                    </div>
                </div>
             </>
           )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;