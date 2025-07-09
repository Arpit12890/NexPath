//now integrate frontend with backend using redux toolkit with use of rtkquery.

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { authApi } from '../features/api/authApi';
import { courseApi } from '@/features/api/courseApi';
import { purchaseApi } from '@/features/api/purchaseApi';
import { courseProgressApi } from '@/features/api/courseProgressApi';

//create a store 
export const appStore=configureStore({
    reducer: rootReducer,
    //now provide middleware to store
    middleware: (defaultMiddleware) =>
        defaultMiddleware().concat(authApi.middleware,courseApi.middleware,purchaseApi.middleware,courseProgressApi.middleware)
}); 

//reload pr always user rhega phele se
const initializeApp=async()=>{
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({}, {forceRefetch: true}));
}
initializeApp();
