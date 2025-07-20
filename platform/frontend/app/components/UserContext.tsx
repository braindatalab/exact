"use client";
import React, { useState, useContext, useEffect } from "react";
import { UserData } from "./types";
import axios, { AxiosInstance } from "axios";
import { BASE_URL_API } from "./utils";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL_API,
  withCredentials: true,
});

// Utility function to get CSRF token
export const getCSRFToken = async (): Promise<string | null> => {
  try {
    const response = await axios.get(`${BASE_URL_API}/csrf/`, { withCredentials: true });
    return response.data.csrfToken;
  } catch (error) {
    console.warn('Failed to fetch CSRF token:', error);
    return null;
  }
};

const UserContext = React.createContext<UserData | null | undefined>(null); // undefined -> user not loaded; null -> user loaded, but not signed in
const UserUpdateContext = React.createContext<Function>(() => {});
const ClientContext = React.createContext<AxiosInstance>(axios.create());

export const useUser = () => {
  return useContext(UserContext);
};
export const useUserUpdate = () => {
  return useContext(UserUpdateContext);
};
export const useClient = () => {
  return useContext(ClientContext);
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null | undefined>(undefined);

  const updateUser = (newUser: UserData) => {
    setUser(newUser);
  };

  useEffect(() => {
    client
      .get("/user")
      .then(({ data }) => {
        setUser(data.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  return (
    <UserContext.Provider value={user}>
      <UserUpdateContext.Provider value={updateUser}>
        <ClientContext.Provider value={client}>
          {children}
        </ClientContext.Provider>
      </UserUpdateContext.Provider>
    </UserContext.Provider>
  );
}