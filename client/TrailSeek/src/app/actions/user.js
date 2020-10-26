import types from "../types";
const { 
    SET_TOKEN, 
    SET_USER 
} = types;

export const setToken = payload => ({
	type: SET_TOKEN,
	payload,
});

export const setUser = payload => ({
	type: SET_USER,
	payload,
});
