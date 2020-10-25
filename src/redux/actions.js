import {
  tableActionTypes,
  formulaActionTypes,
} from './actionTypes';

const {
  SAVE_TABLE_RESIZE_COL_VALUES,
  SAVE_TABLE_RESIZE_ROW_VALUES,
  SAVE_TABLE_CELL_DATA,
  SET_TARGET_CELL_ID,
} = tableActionTypes;

const {
  SET_FORMULA_TEXT,
} = formulaActionTypes;

const saveTableResize = (resizeData, propToDispatch) => ({
  type: resizeData.width ? SAVE_TABLE_RESIZE_COL_VALUES : SAVE_TABLE_RESIZE_ROW_VALUES,
  payload: {
    id: resizeData.id,
    [propToDispatch]: resizeData[propToDispatch],
  },
});

const saveTableCellData = (cellId, cellData) => ({
  type: SAVE_TABLE_CELL_DATA,
  payload: { cellId, cellData },
});

const setTargetCellId = (cellId) => ({
  type: SET_TARGET_CELL_ID,
  payload: cellId,
});

const setFormulaText = (text) => ({
  type: SET_FORMULA_TEXT,
  payload: text,
});

export {
  saveTableResize,
  saveTableCellData,
  setTargetCellId,

  setFormulaText,
};
