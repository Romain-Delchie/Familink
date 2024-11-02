import { createContext } from "react";

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

type FamilyType = {
  id: string;
  name: string;
  members: object[];
  events: event[];
  shopping_lists: ShoppingList[];
  todo_items: todoItem[];
  documentId: string;
};

type ShoppingList = {
  name: string;
  id: string;
  list_items: object[];
};

interface AppContextProps {
  userFamily: object | null;

  updateUserFamily: (newUser: object) => void;

  family: FamilyType | null;

  updateFamily: (newFamily: FamilyType) => void;
}

const AppContext = createContext<AppContextProps>({
  userFamily: null,

  updateUserFamily: () => {},
  family: null,
  updateFamily: () => {},
});

export default AppContext;
