import { tableActionTypes } from './actionTypes';

const {
  SAVE_TABLE_RESIZE_COL_VALUES,
  SAVE_TABLE_RESIZE_ROW_VALUES,
  SAVE_TABLE_CELL_DATA,
  SET_TARGET_CELL_ID,
} = tableActionTypes;

export const rootReducer = (state, action) => {
  switch (action.type) {
    case SAVE_TABLE_RESIZE_COL_VALUES: {
      return {
        ...state,
        tableState: {
          ...state.tableState,
          cols: {
            ...state.tableState.cols,
            [action.payload.id]: {
              ...state.tableState[action.payload.id],
              width: action.payload.width,
            },
          },
        },
      };
    }
    case SAVE_TABLE_RESIZE_ROW_VALUES: {
      return {
        ...state,
        tableState: {
          ...state.tableState,
          rows: {
            ...state.tableState.rows,
            [action.payload.id]: {
              ...state.tableState[action.payload.id],
              height: action.payload.height,
            },
          },
        },
      };
    }
    case SAVE_TABLE_CELL_DATA:
      return {
        ...state,
        tableState: {
          ...state.tableState,
          cells: {
            ...state.tableState.cells,
            [action.payload.cellId]: {
              ...state.tableState.cells[action.payload.cellId],
              ...action.payload.cellData,
            },
          },
        },
      };
    case SET_TARGET_CELL_ID:
      return {
        ...state,
        tableState: {
          ...state.tableState,
          targetCellId: action.payload,
        },
      };
    default:
      return state;
  }
};
