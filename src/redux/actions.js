import {
  tableActionTypes,
  formulaActionTypes,
  headerActionTypes,
} from './actionTypes';

const {
  SAVE_TABLE_RESIZE_COL_VALUES,
  SAVE_TABLE_RESIZE_ROW_VALUES,
  SAVE_TABLE_CELL_DATA,
  SET_TARGET_CELL_ID,
  CHANGE_DATE,
} = tableActionTypes;
const {
  SET_FORMULA_TEXT,
} = formulaActionTypes;
const {
  CHANGE_TABLE_NAME,
} = headerActionTypes;

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

const changeTableName = (tableName) => ({
  type: CHANGE_TABLE_NAME,
  payload: tableName,
});

const changeDate = () => ({ type: CHANGE_DATE });

export {
  saveTableResize,
  saveTableCellData,
  setTargetCellId,
  changeDate,

  setFormulaText,

  changeTableName,
};
