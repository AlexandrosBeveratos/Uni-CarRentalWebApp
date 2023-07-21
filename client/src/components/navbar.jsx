import React, {useState} from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router'
import '../css/navbar.css';
import '../css/main.css';
import hambimg from '../media/hambcheckbox.png'

function Navbar() {
  const navigate = useNavigate()
  //Setting checkbox variable for hamburger menu
  const [checked, setChecked] = useState(false);
  //Css as a variable for mobile navbar
  const sidemenu = {
    right: 100,
    position: "absolute"
  }
  const user = JSON.parse(sessionStorage.getItem("user"));
  let isLogged, isAdmin;
  //Check authentication for the Navbar
  if(user == null){
    isLogged = false;
  }
  else {
    isLogged = true;
    if(user.role === 'admin') isAdmin = true;
  }

  //When user clicks logout, his info in sessionStorage gets wiped and page refreshes
  function logout(){
    sessionStorage.removeItem('user')
    alert('You have been logged out');
    navigate(0);
  }

  const handleCheckbox = (e) => {
    setChecked(e.target.checked)
  }

  return (
    <div className='container'>
      <nav>
        <div id='hambmenubtn'>
          <input type="checkbox" id="check" onChange={handleCheckbox}/>
          <label htmlFor="check" class="checkbtn">
            <img src={hambimg}/>  
          </label>
        </div>
        <label class="logo">RENT WHEELZ</label>
        <ul style={checked ? sidemenu : null}>
          <li><NavLink to={"/"}>Home</NavLink></li>
          <li><NavLink to={"/dashboard"}>Dashboard</NavLink></li>
          <li><NavLink to={"/fleet"}>Fleet</NavLink></li>
          <li><NavLink to={'/reservations'}>Reservations</NavLink></li>
          
          {isAdmin ? (<><li><NavLink to={"/admin"}>Admin</NavLink></li></>) : null} 
          {isLogged ? (<><li style={{fontWeight: 'bold'}}><Link to={"/dashboard"}>{user.username}</Link></li><li><Link onClick={logout}>Log Out</Link></li></>) : 
          (<><li><NavLink to={"/login"}>Log In</NavLink></li><li><NavLink to={"/register"}>Register</NavLink></li></>)} 
        </ul>
      </nav>
      <Outlet />
    </div>
   
  );
}

export default Navbar;