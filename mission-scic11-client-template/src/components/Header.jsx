import { useContext, useState } from "react";
import { Link, NavLink } from "react-router";
import { CgMenuMotion } from "react-icons/cg";
import { RiMenuAddLine } from "react-icons/ri";
import { AuthContext } from "../providers/AuthProvider";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const { user, logOut, setUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menu = [
    { name: "Home", path: "/" },
    { name: "Available Books", path: "/available-books" },
    { name: "Add Book", path: "/add-book" },
    { name: "My Books", path: "/my-books" },
    { name: "Dashboard", path: "/dashboard" },
  ];
  const logOut_btn = () => {
    logOut()
      .then(() => {
        console.log("User logged out successfully");
        setUser(null); // Clear user state on logout
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
      <div className="w-11/12 mx-auto flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-slate-700 dark:text-white">
          📚 BookShare
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-6 font-medium">
          {menu.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600"
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}

          {/* Auth Links */}
          {user?.email ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="rounded-full w-10 h-10" />
                ) : (
                  <FaUserCircle className="text-2xl text-gray-700 dark:text-white" />
                )}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content mt-3 z-[1] p-2 shadow bg-white dark:bg-gray-800 rounded-box w-40 text-sm"
              >
                <li className="px-2 text-gray-800 dark:text-gray-200">
                  {user.displayName || "User"}
                </li>
                <li>
                  <button
                    onClick={logOut_btn}
                    className="w-full text-left px-2 py-3 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <NavLink to="/login" className="text-blue-600 hover:underline">
                Login
              </NavLink>
              <NavLink to="/registration" className="text-blue-600 hover:underline">
                Register
              </NavLink>
            </>
          )}
        </ul>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-2xl">
            {isMenuOpen ? <CgMenuMotion /> : <RiMenuAddLine />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <ul className="flex flex-col bg-white dark:bg-gray-800 px-4 py-4 gap-3 lg:hidden border-t">
          {menu.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-medium"
                  : "text-gray-700 dark:text-gray-300"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}

          {user?.email ? (
            <li className="mt-2 flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <FaUserCircle className="text-2xl text-gray-600 dark:text-white" />
              )}
              <span className="text-gray-800 dark:text-white">{user.displayName || "User"}</span>
              <button
                onClick={logOut}
                className="text-red-600 ml-auto hover:underline"
              >
                Logout
              </button>
            </li>
          ) : (
            <div className="flex flex-col gap-2 mt-3">
              <NavLink to="/login" onClick={() => setIsMenuOpen(false)} className="text-blue-600">
                Login
              </NavLink>
              <NavLink
                to="/registration"
                onClick={() => setIsMenuOpen(false)}
                className="text-blue-600"
              >
                Register
              </NavLink>
            </div>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Header;
