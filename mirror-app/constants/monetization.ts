export const PLANS = {
  free: {
    name: 'Mirror Free',
    features: [
      '7-day score history',
      'Basic check-ins',
      '1 AI insight per week',
      'Single wearable connection',
    ],
    limits: { historyDays: 7, aiInsightsPerWeek: 1, wearables: 1 },
  },
  pro: {
    name: 'Mirror Pro',
    price: '$9.99/month',
    features: [
      'Unlimited history',
      'Daily AI insights',
      'Correlation map (all pairs)',
      'All wearables',
      'Weekly PDF report',
      'Trend predictions',
    ],
    limits: { historyDays: 9999, aiInsightsPerWeek: 7, wearables: 10 },
  },
  elite: {
    name: 'Mirror Elite',
    price: '$24.99/month',
    features: [
      'Everything in Pro',
      'Real-time stress alerts',
      'Personalized coaching plans',
      'Priority AI (GPT-4o with longer context)',
      'Biomarker upload (blood tests)',
      'Export to CSV/PDF',
    ],
    limits: { historyDays: 9999, aiInsightsPerWeek: 99, wearables: 99 },
  },
} as const;

export type PlanKey = keyof typeof PLANS;
