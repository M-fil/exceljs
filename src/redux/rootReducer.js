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
} = tableActionTypes;
const {
  SET_FORMULA_TEXT,
} = formulaActionTypes;
const {
  CHANGE_TABLE_NAME,
} = headerActionTypes;

export const rootReducer = (state, action) => {
  switch (action.type) {
    case SAVE_TABLE_RESIZE_COL_VALUES: {
      return {
        ...state,
        cols: {
          ...state.cols,
          [action.payload.id]: {
            ...state[action.payload.id],
            width: action.payload.width,
          },
        },
      };
    }
    case SAVE_TABLE_RESIZE_ROW_VALUES: {
      return {
        ...state,
        rows: {
          ...state.rows,
          [action.payload.id]: {
            ...state[action.payload.id],
            height: action.payload.height,
          },
        },
      };
    }
    case SAVE_TABLE_CELL_DATA:
      return {
        ...state,
        cells: {
          ...state.cells,
          [action.payload.cellId]: {
            ...state.cells[action.payload.cellId],
            ...action.payload.cellData,
          },
        },
      };
    case SET_TARGET_CELL_ID:
      return {
        ...state,
        targetCellId: action.payload,
      };
    case SET_FORMULA_TEXT:
      return {
        ...state,
        formulaText: action.payload,
      };
    case CHANGE_TABLE_NAME:
      return {
        ...state,
        tableName: action.payload,
      };
    default:
      return state;
  }
};
