import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./Main";
import Create from "./Create";
import Edit from "./Edit";
import NotFound from "./NotFound";

const RoutesComp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/create" element={<Create />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default RoutesComp;
