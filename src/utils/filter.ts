import numeral from 'numeral';

const filters = {
  formatDollar: (value: any) =>   
    value ? numeral(value).format('($ 0.00a)') : '$ 0',
  formatEur: (value: any) =>   
    value ? numeral(value).format('0,0[.]00') + '€'  : '0€',
  formatPercent: (value: any) => {
    const numValue = Number(value);
    return !isNaN(numValue) ? `${numValue.toFixed(2)}%` : '0%';
  },
}

export default filters 