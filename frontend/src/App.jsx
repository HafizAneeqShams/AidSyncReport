// import { useEffect, useState } from "react";
// import axios from "axios";
// import Sidebar from "./components/Sidebar";
// import SectionView from "./components/SectionView";
// import Login from "./components/Login";

// const API = "http://localhost:5000/api/sections";

// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [sections, setSections] = useState([]);
//   const [selected, setSelected] = useState(null);

//   useEffect(() => {
//     // Data sirf tab fetch karein jab user login ho chuka ho
//     if (isLoggedIn) {
//       const fetchSections = async () => {
//         const res = await axios.get(API);
//         setSections(res.data);
//         if (res.data.length > 0) setSelected(res.data[0]);
//       };
//       fetchSections();
//     }
//   }, [isLoggedIn]);

//   // Logout Function
//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setSections([]);
//     setSelected(null);
//   };

//   // Agar login nahi hai, to sirf Login page show karein
//   if (!isLoggedIn) {
//     return <Login onLogin={() => setIsLoggedIn(true)} />;
//   }

//   // Agar login hai, to purani website show karein
//   return (
//     <div className="app">
//       <Sidebar
//         sections={sections}
//         selected={selected}
//         onSelect={setSelected}
//         onLogout={handleLogout} /* <-- Yeh naya add hua hai */
//       />
//       <div className="content">
//         {selected ? (
//           <SectionView section={selected} />
//         ) : (
//           <div className="empty">
//             <h2>Loading Documentation...</h2>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import SectionView from "./components/SectionView";
import Login from "./components/Login";

// const API = "http://localhost:5000/api/sections";
const API = "https://aidsyncreport.vercel.app";


export default function App() {
  // Check karein ke browser mein pehle se login hai ya nahi
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  
  const [sections, setSections] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchSections = async () => {
        const res = await axios.get(API);
        setSections(res.data);
        if (res.data.length > 0) setSelected(res.data[0]);
      };
      fetchSections();
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true"); // Browser mein save kar diya
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // Browser se delete kar diya
    setIsLoggedIn(false);
    setSections([]);
    setSelected(null);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Sidebar
        sections={sections}
        selected={selected}
        onSelect={setSelected}
        onLogout={handleLogout}
      />
      <div className="content">
        {selected ? (
          <SectionView section={selected} />
        ) : (
          <div className="empty">
            <h2>Loading Documentation...</h2>
          </div>
        )}
      </div>
    </div>
  );
}
