// File: src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import Rooms from './Pages/Rooms/RoomDetails';
import Aadhar from './Pages/Aadhar/AadharDetails';
import Tenants from './Pages/Tenants/TenantDetails';
import Complaints from './Pages/Complaints/ComplaintsDetails';
import News from './Pages/News/NewsDetails';
import Meals from './Pages/Meals/MealsDetails';
import Accounts from './Pages/Accounts/AccountsDetails';
import Reports from './Pages/Reports/ReportDetails';
import Enquiry from './Pages/Enquiry/EnquiryDetails';
import Setup from './Pages/Setup/SetupDetails';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/aadhar" element={<Aadhar />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/news" element={<News />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/setup" element={<Setup />} />
          {/* Redirect any unknown routes to the home page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
