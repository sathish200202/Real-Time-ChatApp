import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { LogIn, LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <header
      className="bg-base-200 border-b border-base-200 shadow-md fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-200/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
          </div>

          <div className="flex text-primary  items-center gap-2">
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 hover:bg-primary transition-colors hover:text-gray-200
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {!authUser && (
              <div className="flex text-primary  items-center gap-2">
                <Link
                  to={"/login"}
                  className={`
              btn btn-sm gap-2 hover:bg-primary transition-colors hover:text-gray-200
              
              `}
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </div>
            )}

            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className={`btn btn-sm hover:btn-primary gap-2 hover:text-gray-200`}
                >
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="flex gap-2 items-center btn btn-sm hover:btn-primary hover:text-gray-200"
                  onClick={logout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
