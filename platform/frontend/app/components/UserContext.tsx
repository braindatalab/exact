"use client";
import React, { useState, useContext, useEffect } from "react";
import { UserData, UserProfile } from "./types";
import axios, { AxiosInstance } from "axios";
import { BASE_URL_API } from "./utils";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL_API,
  withCredentials: true,
});

export interface User {
  email: string;
  username: string;
  company_name?: string;
  profile?: UserProfile;
}

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

  const fetchUser = async () => {
    try {
      const response = await client.get('/user');
      if (response.data && response.data.user) {
        setUser(response.data.user); // user.profile will be present
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
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