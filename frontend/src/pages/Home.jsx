import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";
import UserLogout from "./UserLogout";
import { Link } from "react-router-dom";

const Home = () => {

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Comm</h1>
              <div className="ml-6 flex items-center bg-gray-100 rounded-lg px-4 py-2">
                <input
                  type="text"
                  placeholder="Search communities..."
                  className="ml-2 bg-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex items-center">
              <UserLogout />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="space-y-2">
                <div>
                  {["Profile", "Direct Messages", "Questions"].map((elem, index) => (
                    <Link
                      key={index}
                      to={`/${elem.toLocaleLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        {elem[0]}
                      </div>
                      <span className="ml-2">{elem}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <hr className="w-full h-4 border-none bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition-colors" />

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Your Communities</h2>
              <div className="space-y-2">
                {["Web Dev", "UX Design", "Tech News"].map((community) => (
                  <div
                    key={community}
                    className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
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

          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Recent Questions</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((post) => (
                  <div
                    key={post}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-2">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        U
                      </div>
                      <div>
                        <h3 className="font-semibold">User {post}</h3>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <p className="text-gray-800">
                      How to implement authentication in React apps properly?
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
