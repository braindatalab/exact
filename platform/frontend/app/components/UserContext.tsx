"use client";
import React, { useState, useContext, useEffect } from "react";
import { UserData } from "./types";
import axios, { AxiosInstance } from "axios";
import { BASE_URL_API } from "./utils";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials;

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL_API,
  withCredentials: true,
});

const UserContext = React.createContext<UserData | null>(null);
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
  const [user, setUser] = useState<UserData | null>(null);

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
