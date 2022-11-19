import { connect } from "react-redux"
import { useNavigate } from "react-router-dom";
import { logout_creator } from "../Redux/action_creator"
import "./Navbar.css"


function Navbar({loginStatus, logout_action_creator}) {

    const navigate = useNavigate();

    function logout(){
        // make changes to redux store
        logout_action_creator();
        // clear local storage
        localStorage.removeItem("uuid");
        localStorage.removeItem("token");
        // Navigate back to home
        navigate("/login")
    }

  return (
    <div className="navbar">
        <h3 className="brandtitle">e-commerce</h3>
        <div className="quicklinks_big_screen">
            <p onClick={()=>navigate("/")}>Home</p>
            <p onClick={()=>navigate("/cart")}>Cart</p>
            {loginStatus ? 
                <p onClick={logout}>Logout</p>
                :
                <p onClick={() => navigate("/login")}>Login</p>
            }
        </div>
    </div>
  )
}


// making state avaialable to component using react-redux binding so we can acess the login status of user from our component
// Also dispatch the necessary action from our component
const mapStateToProps = (state) => {
    return{
      loginStatus: state.isLoggedIn
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        logout_action_creator : () => dispatch(logout_creator())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)