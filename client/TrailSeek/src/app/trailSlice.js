import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import trailSeek from '../api/trailSeek';
import {Intersect} from '../util/Intersect'

const initialState = {
  trails:[],
  trailDetails:[],
  filteredTrails:[],
  loadedID:[],//Redundent, refactore code todo
  status:'idle',
  error:null
};

export const fetchTrails = createAsyncThunk('trails/fetchTrails',async ({fields="",limit=10,query={}})=>{
    try{
        const response = await trailSeek.get('/trails',{
          params:{
            fields:fields,
            limit:limit,
            q:JSON.stringify(query)
          }
        });
        // console.log(response.data)
        return response.data
        
    }
    catch(error){
        console.log(error);
    };
})

export const fetchTrailsByQuery = createAsyncThunk('trails/fetchTrailsByQuery',async ({limit=10,query={}})=>{
  try{
      const response = await trailSeek.get('/trails',{
        params:{
          fields:"_id",
          limit:limit,
          q:JSON.stringify(query)
        }
      });
      return response.data
  }
  catch(error){
      console.log(error);
  };
})

export const fetchTrailsByID = createAsyncThunk('trails/fetchTrailsByID',async ({fields,id},{getState})=>{
  try{
      const response = await trailSeek.get(`/trails/${id}?fields=${fields}`);
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
      const existingTrail = state.trails.find((trail)=>{trail._id===trailId});
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
        state.trails = action.payload
      },
      [fetchTrails.rejected]: (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      },
      [fetchTrailsByID.pending]: (state, action) => {
        state.statusID = 'loading'
      },
      [fetchTrailsByID.fulfilled]: (state, action) => {
        state.statusID = 'succeeded'
        state.loadedID.push(action.payload._id);//redundned refactore code
        // console.log(state.loadedID)
        state.trailDetails.push(action.payload);
      },
      [fetchTrailsByID.rejected]: (state, action) => {
        state.statusID = 'failed'
        state.errorID = action.error.message
      },
      [fetchTrailsByQuery.pending]: (state, action) => {
        state.status = 'loading'
      },
      [fetchTrailsByQuery.fulfilled]: (state, action) => {
        state.status = 'succeeded'
        state.filteredTrails = Intersect(state.trails,action.payload)
      },
      [fetchTrailsByQuery.rejected]: (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      },
    }
});

export const {ratingAdded} = trailSlice.actions;

export default trailSlice.reducer;

// export const selectAllTrails = (state) => state.trails.trails;


// IDK dosent work need to check
// export const selectTrailsByID = (state, trailId) => {
//     // console.log(trailId)
//     // console.log(state.trails)
//     state.trails.trails.find(item=>item.id==trailId)
// }; 