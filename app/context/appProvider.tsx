import AppContext from "./appContext";

import React, { useState, ReactNode } from "react";

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [userFamily, setUserFamily] = useState<object | null>(null);
  const [family, setFamily] = useState<object | null>(null);
  const [events, setEvents] = useState(null);
  const [shoppingLists, setShoppingLists] = useState(null);
  const [toDoItems, setToDoItems] = useState(null);

  const updateUserFamily = (newUser: object) => {
    setUserFamily(newUser);
  };

  const updateFamily = (newFamily: object) => {
    setFamily(newFamily);
  };

  // const updateEvents = (newEvents: any) => {
  //   setEvents(newEvents);
  // };

  // const updateShoppingLists = (newShoppingLists: any) => {
  //   setShoppingLists(newShoppingLists);
  // };

  // const updateToDoItems = (newToDoItems: any) => {
  //   setToDoItems(newToDoItems);
  // };

  return (
    <AppContext.Provider
      value={{
        userFamily,
        updateUserFamily,
        family,
        updateFamily,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
