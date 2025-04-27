import React, { createContext, useState, useContext } from "react";
import { Loader } from "react-overlay-loader";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
	const [loading, setLoading] = useState(false);

	const showLoader = () => {
		console.log("UPDATING THE LOADER!!!!");
		setLoading(true);
	};

	const hideLoader = () => {
		setLoading(false);
	};

	return (
		<LoaderContext.Provider value={{ showLoader, hideLoader }}>
			{children}
			{loading && (
				<Loader
					fullpage
                    loading
				/>
			)}
		</LoaderContext.Provider>
	);
};

// The hook is exported as the default export of the module, allowing HMR to work correctly.
export const useGlobalLoader = () => useContext(LoaderContext);
