export const getInitialState = (date = new Date()) => ({
  targetCellId: '',
  formulaText: '',
  tableName: 'New Table',
  date,
  cols: {},
  rows: {},
  cells: {},
});
