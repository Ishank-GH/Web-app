import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import Home from "./pages/Home";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import UserLogout from "./pages/UserLogout";
import 'remixicon/fonts/remixicon.css'
import QuestionList from "./components/QuestionList";
import AskQuestion from "./components/AskQuestion";
import QuestionDetail from "./components/QuestionDetail";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route
          path="/"
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

      </Routes>
    </div>
  );
};

export default App;