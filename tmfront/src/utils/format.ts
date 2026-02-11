export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getDateRange = (period: string): { start: string; end: string } => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  switch (period) {
    case 'month':
      return {
        start: formatDateInput(new Date(year, month, 1)),
        end: formatDateInput(new Date(year, month + 1, 0)),
      };
    case 'prev_month':
      return {
        start: formatDateInput(new Date(year, month - 1, 1)),
        end: formatDateInput(new Date(year, month, 0)),
      };
    case 'fy':
      // Indian Financial Year (April - March)
      const fyStart = month >= 3 ? year : year - 1;
      return {
        start: formatDateInput(new Date(fyStart, 3, 1)),
        end: formatDateInput(new Date(fyStart + 1, 2, 31)),
      };
    case 'ytd':
      return {
        start: formatDateInput(new Date(year, 0, 1)),
        end: formatDateInput(now),
      };
    default:
      return {
        start: formatDateInput(new Date(year, month, 1)),
        end: formatDateInput(now),
      };
  }
};

export const calculateGST = (amount: number, rate: number = 18): number => {
  return Math.round(amount * (rate / 100));
};

export const cn = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};
