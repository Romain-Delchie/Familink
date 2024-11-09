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
  user_lists: userLists[];
  shopping_lists: ShoppingList[];
  todo_items: todoItem[];
  documentId: string;
};

type userLists = {
  documentId: string;
  email: string;
  family: string;
  id: number;
  profile: string;
  firstname: string;
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
  checked?: boolean;
  id?: number;
};

type UserFamily = {
  documentId: string;
  email: string;
  family: string;
  firstname: string;
  lastname: string;
  id: number;
  profile: string;
};

interface AppContextProps {
  userFamily: UserFamily | null;

  updateUserFamily: (newUser: UserFamily) => void;

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
