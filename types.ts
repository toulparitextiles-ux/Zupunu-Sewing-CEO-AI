export interface UnitEconomicsData {
  sellingPrice: number; // Цена продажи на WB (руб)
  fabricCostSom: number; // Стоимость ткани (сом)
  fabricCostRub: number; // Стоимость ткани (руб)
  exchangeRate: number; // Курс обмена (1 руб = Х сом)
  accessoriesCost: number; // Фурнитура (руб)
  laborCost: number; // Пошив (руб)
  packagingCost: number; // Упаковка (руб)
  fulfillmentCost: number; // Фулфилмент + доставка до склада (руб)
  logisticsToClient: number; // Логистика до клиента (с учетом покатушек) (руб)
  marketingBudget: number; // Реклама на единицу (руб)
  taxRate: number; // Налог %
  buyoutPercent: number; // Процент выкупа %
}

export interface CalculationResult {
  totalCost: number;
  marketplaceCommission: number; // Комиссия WB
  logisticsExpenses: number; // Логистика (покатушки + возвраты)
  taxAmount: number;
  netProfit: number;
  marginPercent: number;
  roi: number;
  verdict: 'SCAM' | 'RISKY' | 'GOOD' | 'GOLDMINE';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CALCULATOR = 'CALCULATOR',
  CHAT = 'CHAT',
  CHECKLIST = 'CHECKLIST'
}