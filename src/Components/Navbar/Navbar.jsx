import { connect } from "react-redux"
import { useNavigate } from "react-router-dom";
import { logout_creator, set_cart_creator } from "../Redux/action_creator"
import "./Navbar.css"
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';


// Custom Wrapper for the MUI Navbar
const Wrapper = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
})

// A div tag using simple BOX layout for the quick links
const Links = styled(Box)({
    display: "flex",
    justifyContent: "space-around",
    width: "50%",
    alignItems: "center"
})

// To handle the text
const MyTypography = styled(Typography)({
    transition: "transform 0.5s",
    cursor: "pointer",
    "&:hover": {
        transform: "scale(1.1)",
        textDecoration: "3px underline white"
    }
})


function Navbar({loginStatus, logout_action_creator, cart_value_track, set_cart_action_creator}) {

    const navigate = useNavigate();

    function logout(){
        // make changes to redux store
        logout_action_creator();
        // make the cart count back to 0
        set_cart_action_creator(0);
        // clear local storage
        localStorage.removeItem("uuid");
        localStorage.removeItem("token");
        // Navigate back to home
        navigate("/login")
    }

  return (
    // Custom Navbar

    // <div className="navbar">
    //     <h3 className="brandtitle">e-commerce</h3>
    //     <div className="quicklinks_big_screen">
    //         <p onClick={()=>navigate("/")}>Home</p>
    //         <p onClick={()=>navigate("/cart")}>Cart</p>
    //         {loginStatus ? 
    //             <p onClick={logout}>Logout</p>
    //             :
    //             <p onClick={() => navigate("/login")}>Login</p>
    //         }
    //     </div>
    // </div>

    
    // MUI Navbar
    <AppBar sx={{position: "sticky", top:"0px", marginBottom: "15px"}}>
        <Wrapper>
            <Typography variant="h5">e-commerce</Typography>
            <Links>
                <MyTypography onClick={()=>navigate("/")} variant="p">Home</MyTypography>
                <IconButton onClick={()=>navigate("/cart")}>
                    <Badge badgeContent={cart_value_track} sx={{color: "white"}}>
                        <ShoppingCartIcon sx={{color: "white"}} />
                    </Badge>
                </IconButton>
                
                {loginStatus ? 
                    <MyTypography onClick={logout} variant="p">Log-out</MyTypography>
                    :
                    <MyTypography onClick={() => navigate("/login")} variant="p">Log-in</MyTypography>
                }
            </Links>
        </Wrapper>
    </AppBar>
  )
}


// making state avaialable to component using react-redux binding so we can acess the login status of user from our component
// Also dispatch the necessary action from our component
const mapStateToProps = (state) => {
    return{
      loginStatus: state.user_login.isLoggedIn,
      cart_value_track: state.user_cart.cart
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        logout_action_creator : () => dispatch(logout_creator()),
        set_cart_action_creator : (data) => dispatch(set_cart_creator(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)