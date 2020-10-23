import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import trailSeek from '../api/trailSeek';

const initialState = {
  trails:[],
  loadedID:[],
  status:'idle',
  error:null,
  statusID:'idle',
  errorID:null
};

export const fetchTrails = createAsyncThunk('trails/fetchTrails',async ({fields,limit=10,query={}})=>{

    try{
        const response = await trailSeek.get('/trails',{
          params:{
            fileds:fields,
            limit:limit,
            q:query
          }
        });
        // const response = await trailSeek.get(`/trails?fields=${fields}&limit=${limit}`);
        return response.data
    }
    catch(error){
        console.log(error);
    };
})

export const fetchTrailsByID = createAsyncThunk('trails/fetchTrailsByID',async ({fields,id})=>{
  console.log(`/trails/${id}?fields=${fields}`);
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
          state.loadedID.push(action.payload._id);
          const idx = state.trails.findIndex(a=>a._id===action.payload._id)
          state.trails[idx] = action.payload
        },
        [fetchTrailsByID.rejected]: (state, action) => {
          state.statusID = 'failed'
          state.errorID = action.error.message
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