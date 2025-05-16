import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("userdetails")) || null);
    const [authRole,setAuthRole]=useState(localStorage.getItem("usertype"));
    console.log("AuthUser",authUser);

	return <AuthContext.Provider value={{ authUser, setAuthUser,setAuthRole,authRole }}>{children}</AuthContext.Provider>;
};