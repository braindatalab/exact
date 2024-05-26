"use client";
import React, { useState, useContext, useEffect } from "react";
import { UserData } from "./types";
import axios from "axios";
import { BASE_URL_API } from "./utils";

// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFToken";
// axios.defaults.withCredentials;

// const client = axios.create({
//   baseURL: "http://127.0.0.1:8000",
//   withCredentials: true,
// });

const UserContext = React.createContext<UserData | null>(null);
const UserUpdateContext = React.createContext<Function>(() => {});

export function useUser() {
  return useContext(UserContext);
}

export function useUserUpdate() {
  return useContext(UserUpdateContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  const updateUser = (newUser: UserData) => {
    setUser(newUser);
  };

  // useEffect(() => {
  //   client
  //     .get("/user")
  //     .then(({ data }) => {
  //       setUser(data);
  //       console.log(data);
  //     })
  //     .catch(() => {});
  // }, []);

  return (
    <UserContext.Provider value={user}>
      <UserUpdateContext.Provider value={updateUser}>
        {children}
      </UserUpdateContext.Provider>
    </UserContext.Provider>
  );
}
