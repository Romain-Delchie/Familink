import { createContext } from "react";

interface AppContextProps {
  userFamily: any;

  updateUserFamily: (family: any) => void;
}

const AppContext = createContext<AppContextProps>({
  userFamily: null,

  updateUserFamily: () => {},
});

export default AppContext;
