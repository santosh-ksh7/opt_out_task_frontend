import { useEffect } from "react";
import { useState } from "react"
import "./Home.css"
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
// DIalog box if the user is not looged-in
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { connect } from "react-redux";
import Navbar from "../Navbar/Navbar";
// Toaster notification
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// const base_url = "http://localhost:5000";
const base_url = "https://opt-out-task.herokuapp.com"


function Home({loginStatus}) {
  const navigate = useNavigate();
  // This stores all the product to show
  const[prod2show, setProd2show] = useState([]);
  // Stores the product in user cart
  const[usercart, setUsercart] = useState([]);
  // performs a check
  const[check, setCheck] = useState(null);
  // Open the dialog if not logged-in
  const[open, setOpen] = useState(false);
  // To close the dailog box
  const handleClose = () => {
      setOpen(false)
  }

  useEffect(()=>{
    // fetch call to retrieve all the products available
    fetch(`${base_url}/get-all-product`).then((data) => data.json()).then((data) => setProd2show(data));
    // Login status of user coming from global state mgt. store in redux
    // Only if user is logged in we check for the products in the users cart to render functionality accordingly
    if(loginStatus){
      // if logged in check for products already in users cart
      fetch(`${base_url}/items-in-cart/${localStorage.getItem("uuid")}`).then((data) => data.json()).then((data) => {setCheck(true);setUsercart(data)});
    }else{
      // if not logged-in skip the check
      setCheck(true)
    }
  }, [])

  return (
    <div>
      <Navbar />
      {/* Only after you get all the products data the product card is mounted */}
      {prod2show[0] && check ? 
        <div className="allprod">
          {prod2show.map((ele,index) => <ProductCard obj={ele} key={index} usercart={usercart} setOpen={setOpen} loginStatus={loginStatus} />)}
        </div>
        :
        "Loading products..........."
      }
      {/* Opens up dialog box if user tries to perform action when not signed-in */}
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{textAlign: "center"}}>{"Welcome to e-commerce website"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <h3 style={{textAlign: "center", color: "red"}}>You need to be logged-in in order to access the cart & it's associated functionalitites.</h3>
            <div style={{display: "flex", justifyContent: "space-evenly"}}>
              <Button onClick={handleClose} variant="contained">Close</Button>
              <Button onClick={() => navigate("/login")} variant="contained">Login</Button>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </div>
  )
}



function ProductCard({obj, usercart, setOpen, loginStatus}){

  const navigate = useNavigate();

  // To kep track if product is in users cart or not
  const[incart, setIncart] = useState(false);
  // To keep track of product quantity if product is in users cart
  const[qty, setQty] = useState(0)

  useEffect(()=>{
    // only if user is logged in we check whether the product is already in cart or not
    if(loginStatus){
      // When the product card mounts check if the product already exist & render the functionality accordingly
      let check = usercart.filter((ele) => ele.prod_id === obj._id);
      // If product exists in users cart set the quantity of product from data from backend & mark incart as true
      if(check[0]){
        // If product exists set the incart as true
        setIncart(true);
        // Also if it existes get the quantity of the product
        setQty(Number(check[0].qty));
      }
    }
  },[])

  function addToCart(){
    // sending the data as query params to the backend necessary to perform action
    fetch(`${base_url}/add-to-cart?u_id=${localStorage.getItem("uuid")}&prod_id=${obj._id}`, {
      method: "GET",
      headers: {
        "content-type" : "application/json",
        "x-auth-token" : localStorage.getItem("token")
      }
    }).then((data) => data.json()).then((data) => {
      // when not logged-in
      if(data.msg === "You are not authorized"){
        // open the dailog box asking to be logged-in
        setOpen(true)
      }else{
        // if logged-in perform the action necessary
        toast.success(data.msg);
        setIncart(true);
        // set the qty as 1
        setQty(qty+1)
      }
    })
  }

  function inc_dec(arg){
    if(arg==="inc"){
      // fetch call to increment count in DB side
      fetch(`${base_url}/inc-dec-qty?u_id=${localStorage.getItem("uuid")}&prod_id=${obj._id}&action=inc&qty=${qty+1}`,{
        method: "GET",
        headers: {
          "content-type" : "application/json",
          "x-auth-token" : localStorage.getItem("token")
        }
      }).then((data) => data.json()).then((data) => {
        if(data.msg === "You are not authorized"){
          alert("You need to be logged-in in to perform the action")
        }else{
          toast.success(data.msg);
          setQty(qty+1);
        }
      })
    }else if(arg==="dec"){
      // fetch call to decrement the count
      if(qty === 1){
        // you can't decrease the qty. below 1. 
        toast.warn("You can't decrement the quantity any further. To make the qty zero remove the item from the cart")
      }else{
        // if qty is greater than 1 you can decrement it
        fetch(`${base_url}/inc-dec-qty?u_id=${localStorage.getItem("uuid")}&prod_id=${obj._id}&action=dec&qty=${qty-1}`,{
          method: "GET",
          headers: {
            "content-type" : "application/json",
            "x-auth-token" : localStorage.getItem("token")
          }
        }).then((data) => data.json()).then((data) => {
          if(data.msg === "You are not authorized"){
            alert("You need to be logged-in in to perform the action")
          }else{
            toast.success(data.msg);
            setQty(qty-1)
          }
        })
      }
    }
  }

  function removeFromCart(){
    // fetch call to remove from cart
    fetch(`${base_url}/remove-from-cart?u_id=${localStorage.getItem("uuid")}&prod_id=${obj._id}`, {
      method: "GET",
      headers: {
        "content-type" : "application/json",
        "x-auth-token" : localStorage.getItem("token")
      }
    }).then((data) => data.json()).then((data) => {
      if(data.msg === "You are not authorized"){
        alert("You need to be logged-in to perform the action")
        // Open dialog box asking to log-in
      }else{
        toast.success(data.msg);
        setIncart(false)
        setQty(0)
      }
    })
  }

  function goToSpecificProduct(){
    // Navigate to specific product page
    navigate(`/product-page/${obj._id}`)
  }
  
  return(
    <div title="Click to go to product specific page" className="card">
      <img onClick={goToSpecificProduct} src={obj.img} alt={obj.brand} className="prod_img" />
      <h5 onClick={goToSpecificProduct} className="brand">{obj.brand}</h5>
      <p onClick={goToSpecificProduct} className="des">{obj.descripion}</p>
      <p onClick={goToSpecificProduct} className="price">₹ {obj.price}</p>
      {incart ? 
        // if product in cart render the functionality accordingly
          <div className="if_in_cart">
            <button onClick={removeFromCart} className="btn">Remove from Cart</button>
            <p className="action">
              Qty:-<RemoveIcon onClick={()=>inc_dec("dec")} className="icon_btn" /> {qty} <AddIcon onClick={()=>inc_dec("inc")} className="icon_btn" />
            </p>
          </div>
        :
        // if product not in cart render the functionality accordingly
          <button onClick={addToCart} className="btn">Add to Cart</button> 
      }
    </div>
  )
}

// making state avaialable to component using react-redux binding so we can acess the login status of user from our component
const mapStateToProps = (state) => {
  return{
    loginStatus: state.isLoggedIn
  }
}

export default connect(mapStateToProps, null)(Home)