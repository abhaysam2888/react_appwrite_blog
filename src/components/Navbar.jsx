import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../utils/cn";
import { Menu, MenuItem } from "../components/ui/navbar-menu";
import { useDispatch, useSelector } from "react-redux";
import authService from "../appwrite/auth";
import { logout as authLogout } from '../store/authSlice'

const Navbar = ({ className }) => {
  const [active, setActive] = useState(null);
  const status = useSelector((state) => state.auth.status)
  const dispatch = useDispatch()
  
  const handelClick = async() => {
      const logout = await authService.logout()
      if (logout) {
          dispatch(authLogout())
      }
  }

  return (
      <div className={cn("max-w-2xl mx-auto rounded-full", className)} style={{scrollbarWidth:'none'}}>
        <Menu setActive={setActive}>
          <Link to="/">
            <MenuItem setActive={setActive} active={active} item="Home" />
          </Link>
          <Link to="/addpost">
            <MenuItem setActive={setActive} active={active} item="AddPost" />
          </Link>
          {status ? 
          <button onClick={handelClick}>
            <MenuItem setActive={setActive} active={active} item="Logout" />
          </button> 
            : 
            <div className="flex space-x-5">
                <Link to={'/login'}>
                <MenuItem setActive={setActive} active={active} item="Login" />
                </Link>

                <Link to={'/signup'}>
                <MenuItem setActive={setActive} active={active} item="Signup" />
                </Link>   
            </div>}
        </Menu>
      </div>
  );
};

export default Navbar;
