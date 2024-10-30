import { createContext } from "react";

type FamilyType = {
  id: string;
  name: string;
  members: object[];
  events: object[];
  shoppingLists: object[];
  toDoItems: object[];
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
