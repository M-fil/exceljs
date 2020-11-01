import { createStore } from './createStore';

const INCREMENT_VALUE = 'INCREMENT_VALUE';

const INITIAL_STATE = {
  value: 0,
};

const mockReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INCREMENT_VALUE:
      return {
        ...state,
        value: state.value + 1,
      };
    default:
      return state;
  }
}

describe('createStore:', () => {
  let store = null;
  let handler = null;
  beforeEach(() => {
    store = createStore(mockReducer, INITIAL_STATE);
    handler = jest.fn();
  });

  test('Store should be initialized', () => {
    expect(store).toBeDefined();
    expect(store.subscribe).toBeDefined();
    expect(store.dispatch).toBeDefined();
    expect(store.getState).toBeDefined();
  });

  test('Should return object as a state', () => {
    expect(store).toBeInstanceOf(Object);
  });

  test('Should return default state', () => {
    expect(store.getState()).toEqual(INITIAL_STATE);
  });

  test('Should change state after the action dispatch', () => {
    store.dispatch({ type: INCREMENT_VALUE });
    const { value } = store.getState();
    expect(value).toBe(INITIAL_STATE.value + 1);
  });

  test('Should not change state if action is not exist', () => {
    store.dispatch({ type: 'MOCK' });
    expect(store.getState()).toEqual(INITIAL_STATE);
  });

  test('Should call subscribe function', () => {
    store.subscribe(handler);
    store.dispatch({ type: INCREMENT_VALUE });

    expect(handler).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith(store.getState());
  });

  test('Should not call sub if unsubscribe function was called', () => {
    const { unSubscribe } = store.subscribe(handler);
    unSubscribe();

    store.dispatch({ type: INCREMENT_VALUE });

    expect(handler).not.toHaveBeenCalled();
  });
});
