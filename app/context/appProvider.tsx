import AppContext from "./appContext";

import React, { useState, ReactNode } from "react";

type event = {
  documentId: string;
  name: string;
  date: string;
  begin: string;
  end: string;
  instruction: string;
  author: string;
};

type todoItem = {
  ranking: number;
  name: string;
  author: string;
  documentId: string;
};
// Define FamilyType
interface FamilyType {
  id: number;
  name: string;
  members: object[];
  events: event[];
  user_lists: userLists[];
  shopping_lists: ShoppingList[];
  todo_items: todoItem[];
  documentId: string;
}

interface userLists {
  documentId: string;
  email: string;
  family: string;
  id: number;
  profile: string;
  firstname: string;
}

// Define ShoppingList
interface ShoppingList {
  name: string;
  documentId?: string;
  id: number;
  list_items: listItems[];
}

interface listItems {
  documentId?: string;
  name: string;
  quantity?: string;
  author: string;
  id: number;
}

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [userFamily, setUserFamily] = useState<object | null>(null);
  const [family, setFamily] = useState<FamilyType | null>(null);
  const [events, setEvents] = useState(null);
  const [shoppingLists, setShoppingLists] = useState(null);
  const [toDoItems, setToDoItems] = useState(null);

  const updateUserFamily = (newUser: object) => {
    setUserFamily(newUser);
  };

  const updateFamily = (newFamily: FamilyType) => {
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
