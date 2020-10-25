import types from "../types.js";
const { SET_TOKEN, SET_USER } = types;

const initialState = {
	token: null,
	user: null
};

const user = (state = initialState, { type, payload }) => {
	switch (type) {
		case SET_TOKEN:
            return { ...state, token: payload };
        
        case SET_USER:
			return { ...state, user: payload };
		
		default:
			return state;
	}
};

export default user;
