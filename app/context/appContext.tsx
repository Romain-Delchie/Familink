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
  id: number;
  name: string;
  members: object[];
  events: event[];
  shopping_lists: ShoppingList[];
  todo_items: todoItem[];
  documentId: string;
};

type ShoppingList = {
  name: string;
  documentId?: string;
  id: number;
  list_items: listItems[];
};

type listItems = {
  documentId?: string;
  name: string;
  quantity?: string;
  author: string;
  id: number;
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
