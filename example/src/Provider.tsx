import { createContext } from 'react';

const GlobalContext = createContext({ counter: 0 });

export const Provider = GlobalContext.Provider;

export default GlobalContext;