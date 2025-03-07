import React from "react";
import { Link, Outlet } from "react-router-dom";
import UserLogout from "./UserLogout";
import ProfileDropdown from "./ProfileDropdown";

const MasterLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation / Top Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-1">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center ml-2">
              <img src="../public/Symmunity_Logo.jpg" alt="" className="w-48" />
              <div className="ml-6 flex items-center bg-gray-100 rounded-lg px-4 py-2">
                <input
                  type="text"
                  placeholder="Search communities..."
                  className="ml-2 bg-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex items-center space-x-5">
              <ProfileDropdown />
              <UserLogout />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-9xl mx-auto px-4 sm:px-4 lg:px-5 py-6 flex gap-6">
        {/* Sidebar */}
        <div className="w-1/6 space-y-4">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <div className="h-10 w-10 flex items-center justify-center text-gray-700 bg-gray-50 rounded-lg">
                  <i className="ri-home-5-fill text-2xl"></i>
                </div>
                <span className="text-sm font-medium">Home</span>
              </Link>

              <Link
                to="/direct-messages"
                className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <div className="h-10 w-10 flex items-center justify-center text-gray-700 bg-gray-50 rounded-lg">
                  <i className="ri-message-3-fill text-2xl"></i>
                </div>
                <span className="text-sm font-medium">Messages</span>
              </Link>

              <Link
                to="/questions"
                className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <div className="h-10 w-10 flex items-center justify-center text-gray-700 bg-gray-50 rounded-lg">
                  <i className="ri-question-answer-fill text-2xl"></i>
                </div>
                <span className="text-sm font-medium">Questions</span>
              </Link>
            </div>
          </div>

          <hr className="w-full h-4 border-none bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition-colors" />

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 items-center justify-center">
            
              Your Communities
            </h2>
            <div className="space-y-2">
              {["Web Dev", "UX Design", "Tech News"].map((community) => (
                <div
                  key={community}
                  className="flex items-center px-1 py-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    {community[0]}
                  </div>
                  {community}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow">
          {/* Use children if provided, otherwise fallback to the Outlet */}
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default MasterLayout;
