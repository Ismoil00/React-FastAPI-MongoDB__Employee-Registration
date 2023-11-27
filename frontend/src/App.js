import "./scss/App.scss";
import RoutesComp from "./components/Routes";
import { createContext, useState } from "react";
import EmoloyeeModel from "./helpers/employee-model";

export const EditEmployeeContext = createContext(null);

function App() {
  const [editableEmployee, setEditableEmployee] = useState(EmoloyeeModel);

  return (
    <div className="App">
      <EditEmployeeContext.Provider
        value={[editableEmployee, setEditableEmployee]}
      >
        <RoutesComp />
      </EditEmployeeContext.Provider>
    </div>
  );
}

export default App;
