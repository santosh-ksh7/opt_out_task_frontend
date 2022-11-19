import "./Login.css"
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup"
import TextField from '@mui/material/TextField';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import KeyIcon from '@mui/icons-material/Key';
import { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// Toaster notification
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Redux logic
import { connect } from "react-redux";
import { login_creator, logout_creator } from "../Redux/action_creator";


// const base_url = "http://localhost:5000";
const base_url = "https://opt-out-task.herokuapp.com"



function Login({login_action, logout_action}) {
    const navigate = useNavigate();

    const[showpwd, setShowpwd] = useState(false)

    const loginschema = yup.object({
      email: yup.string().required().email(),
      pwd: yup.string().required().min(8)
    })

    const formik = useFormik({
      initialValues: {email: "", pwd: ""},
      validationSchema: loginschema,
      onSubmit: (values) => {
        // fetch call to login & laert the desired message & also navigate
        fetch(`${base_url}/login`, {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "content-type" : "application/json"
          }
        }).then((data)=>data.json()).then((data)=>{
          if(data.msg==="Succesfully logged in"){
            // storing _id & JWT to local storage
            localStorage.setItem("token", data.token)
            localStorage.setItem("uuid", data.uuid)
            // Take care of redux state mgt. for login as true
            login_action();
            // Navigate to landing page
            navigate("/")
          }else{
            toast.error(data.msg);
            // Take care of redux state mgt. for login as false
            logout_action();
          }
        })
      }
    })

  return (
    <div className="logindiv">
        <div>
            <h2>e-commerce</h2>
            <p>Welcome to e-commerce</p>
            <h4>Sign-in</h4>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    style={{width: "300px"}}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="email"
                    error= {formik.touched.email && formik.errors.email ? true : false}
                    id="standard-error-helper-text"
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailOutlineIcon />
                          </InputAdornment>
                        ),
                    }}
                    label="Email ID"
                    helperText={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                    variant="standard"
                />
                 <TextField
                    style={{width: "300px", marginTop: "10px"}}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="pwd"
                    error= {formik.touched.pwd && formik.errors.pwd ? true : false}
                    id="standard-password-input"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                              <KeyIcon />
                            </InputAdornment>
                          ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={()=> setShowpwd(!showpwd)}>
                                {showpwd ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                    }}
                    label="Password"
                    helperText={formik.touched.pwd && formik.errors.pwd ? formik.errors.pwd : null}
                    type={showpwd ? "text" : "password"}
                    variant="standard"
                />
                <button style={{marginTop: "10px"}} type="submit">Sign-in</button>
            </form>
            <p style={{color: "grey"}}>----------or---------</p>
            <Link style={{marginLeft: "15%", fontSize: "15px", textDecoration: "none"}} to="/register">New to e-commerce? Create Account</Link>
        </div>
        <ToastContainer />
    </div>
  )
}


// making action avaialable to component using react-redux binding so we can dispatch action from our component
const mapDispatchToProps = (dispatch) => {
  return{
    login_action : () => dispatch(login_creator()),
    logout_action : () => dispatch(logout_creator())
  }
}


export default connect(null, mapDispatchToProps)(Login)