import React, { createContext, useContext, useReducer, useEffect } from "react";

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  followedUsers: [],
  followers: [],
};

// Actions
const USER_ACTIONS = {
  SET_USER: "SET_USER",
  LOGOUT: "LOGOUT",
  UPDATE_PROFILE: "UPDATE_PROFILE",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  FOLLOW_USER: "FOLLOW_USER",
  UNFOLLOW_USER: "UNFOLLOW_USER",
  SET_FOLLOWERS: "SET_FOLLOWERS",
  SET_FOLLOWING: "SET_FOLLOWING",
};

// Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
        error: null,
      };

    case USER_ACTIONS.LOGOUT:
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        followedUsers: [],
        followers: [],
      };

    case USER_ACTIONS.UPDATE_PROFILE:
      const updatedUser = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return {
        ...state,
        user: updatedUser,
      };

    case USER_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case USER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case USER_ACTIONS.FOLLOW_USER:
      return {
        ...state,
        followedUsers: [...state.followedUsers, action.payload],
      };

    case USER_ACTIONS.UNFOLLOW_USER:
      return {
        ...state,
        followedUsers: state.followedUsers.filter(
          (id) => id !== action.payload
        ),
      };

    case USER_ACTIONS.SET_FOLLOWERS:
      return {
        ...state,
        followers: action.payload,
      };

    case USER_ACTIONS.SET_FOLLOWING:
      return {
        ...state,
        followedUsers: action.payload,
      };

    default:
      return state;
  }
};

// Context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch({
        type: USER_ACTIONS.SET_USER,
        payload: JSON.parse(storedUser),
      });
    } else {
      dispatch({
        type: USER_ACTIONS.SET_LOADING,
        payload: false,
      });
    }
  }, []);

  // Actions
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    dispatch({
      type: USER_ACTIONS.SET_USER,
      payload: userData,
    });
  };

  const logout = () => {
    dispatch({ type: USER_ACTIONS.LOGOUT });
  };

  const updateProfile = (profileData) => {
    dispatch({
      type: USER_ACTIONS.UPDATE_PROFILE,
      payload: profileData,
    });
  };

  const followUser = (userId) => {
    dispatch({
      type: USER_ACTIONS.FOLLOW_USER,
      payload: userId,
    });
  };

  const unfollowUser = (userId) => {
    dispatch({
      type: USER_ACTIONS.UNFOLLOW_USER,
      payload: userId,
    });
  };

  const setFollowers = (followers) => {
    dispatch({
      type: USER_ACTIONS.SET_FOLLOWERS,
      payload: followers,
    });
  };

  const setFollowing = (following) => {
    dispatch({
      type: USER_ACTIONS.SET_FOLLOWING,
      payload: following,
    });
  };

  const value = {
    ...state,
    login,
    logout,
    updateProfile,
    followUser,
    unfollowUser,
    setFollowers,
    setFollowing,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
