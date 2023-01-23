import { BrowserRouter, Route, Routes } from "react-router-dom";

import Calendar from "./components/Calendar";
import "./App.css";
import DoctorView from "./components/DoctorView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Calendar />} />
        <Route exact path="/doctor" element={<DoctorView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
