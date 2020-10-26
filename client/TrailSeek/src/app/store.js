import { configureStore } from '@reduxjs/toolkit';

import trailsReducer from './trailSlice';

export default configureStore({
    reducer:{
        trails:trailsReducer
    },
    devTools: process.env.NODE_ENV !== 'production',
});