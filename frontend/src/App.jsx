import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./landing/pages/Home";
import Login from "./pages/UserLogin"; 
import Signup from "./pages/UserSignup";
import Home from "./pages/Home";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import UserLogout from "./pages/UserLogout";
import "remixicon/fonts/remixicon.css";
import QuestionList from "./components/QuestionList";
import AskQuestion from "./components/AskQuestion";
import QuestionDetail from "./components/QuestionDetail";
import MasterLayout from "./pages/MasterLayout";
import DirectMessages from "./pages/DirectMessages";
import { SocketProvider } from './context/SocketContext.jsx';
import UserContext from "./context/UserContext";
import Communities from './pages/Communities';
import CommunityDetails from './pages/CommunityDetails';

const App = () => {
  return (
    <UserContext>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<MasterLayout />}>
            <Route
              path="/home"
              element={
                <UserProtectedWrapper>
                  <Home />
                </UserProtectedWrapper>
              }
            />
            <Route
              path="/logout"
              element={
                <UserProtectedWrapper>
                  <UserLogout />
                </UserProtectedWrapper>
              }
            />
            <Route
              path="/questions"
              element={
                <UserProtectedWrapper>
                  <QuestionList />
                </UserProtectedWrapper>
              }
            />
            <Route
              path="/questions/create"
              element={
                <UserProtectedWrapper>
                  <AskQuestion />
                </UserProtectedWrapper>
              }
            />
            <Route
              path="/questions/:questionId"
              element={
                <UserProtectedWrapper>
                  <QuestionDetail />
                </UserProtectedWrapper>
              }
            />
            <Route
              path="/direct-messages"
              element={
                <UserProtectedWrapper>
                  <DirectMessages />
                </UserProtectedWrapper>
              }
            />
            <Route 
              path="/communities" 
              element={
                <UserProtectedWrapper>
                  <Communities />
                </UserProtectedWrapper>
              } 
            />
            <Route 
              path="/communities/:communityId" 
              element={
                <UserProtectedWrapper>
                  <CommunityDetails />
                </UserProtectedWrapper>
              } 
            />
          </Route>
        </Routes>
      </SocketProvider>
    </UserContext>
  );
};

export default App;
