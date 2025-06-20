import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 


const rootReducer = combineReducers({
  user: userReducer,
});


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
};


const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
