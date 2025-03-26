import { useState } from "react";
import "./App.css";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Issues from "./components/Issues";
import Status from "./components/Status";
import Login from "./components/Login";
import Location from "./components/Location";
import Accepted from "./components/Accepted";
import Rejected from "./components/Rejected";
import Completed from "./components/Completed";
import Connect from "./components/Connect";
import AdminSignup from "./components/adminsignup.js";
import AdminLogin from "./components/adminlogin.js";
import { Route, Routes, Router } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminDashboard from "./components/adminhome.js";
import AdminNavBar from "./components/adminnav.js";
import AdminIssueDetails from "./components/adminproblemDetail.js";
import JitsiMeeting from "./components/JitsiMeeting";
//require("dotenv").config();

// let payload = {
//   meetingNumber: 123456789,
//   passcode: "none",
//   role: 0,
//   sdkkey: process.env.REACT_APP_ZOOM_API_KEY,
//   sdksecret: process.env.REACT_APP_ZOOM_API_SECRET,
//   userName: "Narendra",
//   userEmail: "",

//   user_id: ""

// }
function App() {
  const [islogedin, setlogin] = useState(false);
  const [allComplaints, setAllComplaints] = useState([]);
  const PrivateRoute = ({ element }) => {
    return islogedin ? element : <Navigate to="/Login" replace />
  }
  const handleFormSubmit = (formData) => {
    setAllComplaints((prev) => [...prev, { ...formData, id: Date.now() }]);
  };

  return (
    <div>

      <Routes>

        <Route path="/" element={<PrivateRoute element={
          <>

            <Navbar islogedin={islogedin} setlogin={setlogin} />
            <Home />

          </>



        } />} />

        <Route path="/issues" element={
          <>
            <Navbar islogedin={islogedin} setlogin={setlogin} />
            <Issues onSubmit={handleFormSubmit} />
          </>
        }


        />
        <Route path="/signup" element={
          <>
            <Navbar islogedin={islogedin} setlogin={setlogin} />
            <Signup setlogin={setlogin} />
          </>
        }
        />
        <Route path="/Login" element={
          <>
            <Navbar islogedin={islogedin} setlogin={setlogin} />
            <Login setLogin={setlogin} />
          </>

        }
        />
        <Route path="/status" element={
          <>
            <Navbar islogedin={islogedin} setlogin={setlogin} />
            <Status setlogin={setlogin} />
          </>
        }
        />

        <Route path="/adminsignup" element={
          <>
            <Navbar islogedin={islogedin} setlogin={setlogin} />
            <AdminSignup setlogin={setlogin} />
          </>
        }
        />
        <Route path="/adminlogin" element={
          <>
            <Navbar islogedin={islogedin} setlogin={setlogin} />
            <AdminLogin setlogin={setlogin} />
          </>
        }
        />


        <Route path="/adminhome" element={

          <>
            <AdminNavBar islogedin={islogedin} setlogin={setlogin} />
            <AdminDashboard />
            {/* <adminnav islogedin={islogedin} setlogin={setlogin} /> */}
          </>

        } />

        <Route path="/Location" element={

          <>
            <AdminNavBar islogedin={islogedin} setlogin={setlogin} />
            <Location />

          </>

        } />

        <Route path="/Accepted" element={

          <>
            <AdminNavBar islogedin={islogedin} setlogin={setlogin} />
            <Accepted />

          </>

        } />
        <Route path="/Rejected" element={

          <>
            <AdminNavBar islogedin={islogedin} setlogin={setlogin} />
            <Rejected />

          </>

        } />
        <Route path="/Completed" element={

          <>
            <AdminNavBar islogedin={islogedin} setlogin={setlogin} />
            <Completed />

          </>

        } />



        <Route path="/Connect" element={
          <>
            <AdminNavBar />
            <Connect />
          </>
        } />

        {/* Jitsi Meeting Page */}
        <Route path="/Jitsi/:roomName" element={<JitsiMeeting />} />

        <Route path="/status" element={<Status allComplaints={allComplaints} />} />

        <Route path="/adminDetails/:id" element={
          <>
            <AdminNavBar islogedin={islogedin} setlogin={setlogin} />
            <AdminIssueDetails />
          </>
        } />
      </Routes>

    </div>
  )
}

export default App;
