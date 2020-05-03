import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({children}) => (
    <>
        {children}
        <Footer />
    </>
);

export default Layout;