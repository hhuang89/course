import { ConfigContext } from "antd/lib/config-provider";
import React, { createContext, useReducer, Dispatch, useContext } from "react";

interface MessageState {
  total: number;
  notification: number;
  message: number;
}
type MessageType = "notification" | "message" | "total";
type Action = "increment" | "reset" | "decrement";
type MessageAction = {
  type: Action;
  payload?: { type: MessageType; count: number };
};

const initialState: MessageState = {
  total: 0,
  message: 0,
  notification: 0,
};

const Reducer = (state: MessageState, action: MessageAction) => {
  switch (action.type) {
    case "increment":
      return {
        ...state,
        [action.payload.type]:
          action.payload.count + state[action.payload.type],
        total: state.total + action.payload.count,
      };
    case "decrement":
      return {
        ...state,
        [action.payload.type]:
          state[action.payload.type] - action.payload.count,
        total: state.total - action.payload.count,
      };
    case "reset":
      return {
        ...initialState,
      };

    default:
      throw new Error();
  }
};

//why null?
export const Context = createContext<{
  state: MessageState;
  dispatch: Dispatch<MessageAction>;
}>(null);

//initial while the app start
export const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export const MessageConsumer = () =>
  useContext<{ state: MessageState; dispatch: Dispatch<MessageAction> }>(
    Context
  );
