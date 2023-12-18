import { configureStore } from '@reduxjs/toolkit';
import passwordReducer from '../reducer/passwordSlice';
import loginReducer from '../reducer/loginSlice';
import userReducer from '../reducer/userSlice';
import updateReducer from '../reducer/updateSlice';
import deleteReducer from '../reducer/deleteSlice';
import modalReducer from '../reducer/modalSlice';

export const store = configureStore({
  reducer: {
    password: passwordReducer,
    login: loginReducer,
    users: userReducer,
    update: updateReducer,
    delete: deleteReducer,
    modal: modalReducer,
  },
});
