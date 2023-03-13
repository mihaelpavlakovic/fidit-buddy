import { createContext, useReducer } from "react";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
	const INITIAL_STATE = {
		chatId: "null",
		user: {},
	};

	const chatReducer = (state, action) => {
		switch (action.type) {
			case "CHANGE_USER":
				return {
					user: action.payload,
					chatId: action.payload.messagesUid,
				};

			default:
				return state;
		}
	};

	const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

	return (
		<ChatContext.Provider value={{ chatData: state, dispatch }}>
			{children}
		</ChatContext.Provider>
	);
};
