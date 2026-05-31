import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { selectAuth, logout } from '../features/auth/authSlice.js';
import { resetSubscriptions } from '../features/subscriptions/subscriptionsSlice.js';

/** Convenience hook exposing auth state and a combined logout action. */
export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);

  const signOut = useCallback(async () => {
    await dispatch(logout());
    dispatch(resetSubscriptions());
  }, [dispatch]);

  return { ...auth, signOut };
};
