import {createSlice} from '@reduxjs/toolkit';

const initialState={
    user:null,
    isAuthenticated:false
};

const authSlice=createSlice({
    name:"authSlice",
    initialState,
    reducers:{
        //Reducers update the state when actions are dispatched.
        //userLoggedIn({name:"arpit"})
        userLoggedIn:(state,action)=>{
            state.user=action.payload.user; //action.payload wala reponse hoga server se aayegi usse store kr rhe h state.user me jisse store ko update kr ske.
            state.isAuthenticated=true;
        },
        userLoggedOut:(state)=>{
            state.user=null;
            state.isAuthenticated=false;
        }
    }
});

export const {userLoggedIn,userLoggedOut}=authSlice.actions;
export default authSlice.reducer;