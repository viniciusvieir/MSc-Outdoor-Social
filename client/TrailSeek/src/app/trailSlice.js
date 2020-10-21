import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import trailSeek from '../api/trailSeek';

const initialState = {
  trails:[],
  status:'idle',
  error:null
};

export const fetchTrails = createAsyncThunk('trails/fetchTrails',async ()=>{
    try{
        const response = await trailSeek.get('/trails');
        //console.log(response);
        return response.data
    }
    catch(error){
        console.log(error);
    };
})

export const trailSlice = createSlice({
    name: 'trails',
    initialState,
    reducers:{
      ratingAdded(state, action){
        const { trailId, rating } = action.payload;
        const existingTrail = state.trails.find((trail)=>{trail.id===trailId});
        if (existingTrail){
          existingTrail.rating[rating]++;
        }
      }
    },
    extraReducers: {
        [fetchTrails.pending]: (state, action) => {
          state.status = 'loading'
        },
        [fetchTrails.fulfilled]: (state, action) => {
          state.status = 'succeeded'
          // Add any fetched posts to the array
          state.trails = state.trails.concat(action.payload)
        },
        [fetchTrails.rejected]: (state, action) => {
          state.status = 'failed'
          state.error = action.error.message
        }
      }
});

export const {ratingAdded} = trailSlice.actions;

export default trailSlice.reducer;

export const selectAllTrails = (state) => state.trails.trails;


// IDK dosent work need to check
// export const selectTrailsByID = (state, trailId) => {
//     // console.log(trailId)
//     // console.log(state.trails)
//     state.trails.trails.find(item=>item.id==trailId)
// }; 