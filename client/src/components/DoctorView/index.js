import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

//using functional component for doctor view
const DoctorView = () => {
  //use state to store the appointment list
  const [appointmentList, setAppointmentList] = useState([]);

  //use effect to get appointment list from backend once after every render
  useEffect(() => {
    getAppointments();
  }, []);

  //function to fetch list
  const getAppointments = async () => {
    const response = await fetch("http://localhost:3001/get");
    const data = await response.json();
    console.log(data);
    setAppointmentList(data);
  };

  //rendering user interface
  return (
    <div className="bg">
      <h1 className="heading">Doc Appointment App</h1>
      <Link to="/" className="link">
        <button type="button" className="btn">
          Switch to User
        </button>
      </Link>
      <p className="para">Your Appointments</p>
      {appointmentList.length === 0 ? (
        //conditional rendering to show heading element when list is empty
        <h1>You Have Zero Appointments</h1>
      ) : (
        <ul>
          {appointmentList.map((eachItem) => {
            //creating date object from string
            let s = new Date(eachItem.start);

            return (
              <li key={eachItem._id}>
                <p>
                  {eachItem.title}-{s.toLocaleDateString()}-
                  {s.toLocaleTimeString()}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DoctorView;
