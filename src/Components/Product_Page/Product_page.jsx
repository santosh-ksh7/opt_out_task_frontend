import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import "./Product_Page.css"
// DIalog box if the user is not looged-in
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { connect } from "react-redux";
import Navbar from "../Navbar/Navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// const base_url = "http://localhost:5000";
const base_url = "https://opt-out-task.herokuapp.com"

function ProductPage({loginStatus}){
    const navigate = useNavigate();
    // Get the product id to get product details from the URL 
    const{id} = useParams();
    // To check if product exist already in user cart
    const[checkcart, setCheckcart] = useState(false)
    // To store the product info
    const[prodinfo, setProdinfo] = useState(null)
    // To keep track of quantity of product if already in cart or else initialized to 0
    const[qty, setQty] = useState(0);
    // Open the dialog if not logged-in
    const[open, setOpen] = useState(false);
    // To close the dailog box
    const handleClose = () => {
        setOpen(false)
    }

    // Get the product Data when the component first mounts
    useEffect(() => {
        // fetch call to get the product info & store the info
        fetch(`${base_url}/get-single-product/${id}`).then((data) => data.json()).then((data) => setProdinfo(data))
        // Login status of user coming from global state mgt. store in redux
        // Only if user is logged in we check for the products in the users cart to render functionality accordingly
        if(loginStatus){
            // check if product already exists in user cart.
            fetch(`${base_url}/check-product-in-cart?u_id=${localStorage.getItem("uuid")}&prod_id=${id}`).then((data) => data.json()).then((data) => {
                if(data.msg){
                    // if product already in user cart get the quantity details
                    setCheckcart(true);
                    setQty(Number(data.qty));
                }else{
                    // if product not in users cart already
                    setCheckcart(false);
                }
            })
        }
    }, [])
    

    return(
        <div>
          <Navbar />
          <div className="main_prod_container">
              {/* Only after getting the product data mount the ProductDisplay component */}
              {prodinfo ?
                  <ProductDisplay obj={prodinfo} checkcart={checkcart} qty={qty} setCheckcart={setCheckcart} setQty={setQty} setOpen={setOpen} />
                  :
                  "Loading product info......"
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
          </div>
          <ToastContainer />
        </div>
    )
}


function ProductDisplay({obj, checkcart, qty, setCheckcart, setQty, setOpen}){

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
            // if user is logged in perform the action & track product qty. to alter it
            toast.success(data.msg)
            setCheckcart(true);
            // set the qty as 1 when product is initially added to the cart
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
              toast.warn("You need to be logged-in in to perform the action")
            }else{
              toast.success(data.msg)
              setQty(qty+1);
            }
          })
        }else if(arg==="dec"){
          // fetch call to decrement the count
          if(qty === 1){
            // if quantity is 1 you can't decrement it any further.
            toast.warn("You can't decrement the quantity any further. To make the qty zero remove the item from the cart")
          }else{
            // if quantity is more than 1 you can decrement it
            fetch(`${base_url}/inc-dec-qty?u_id=${localStorage.getItem("uuid")}&prod_id=${obj._id}&action=dec&qty=${qty-1}`,{
              method: "GET",
              headers: {
                "content-type" : "application/json",
                "x-auth-token" : localStorage.getItem("token")
              }
            }).then((data) => data.json()).then((data) => {
              if(data.msg === "You are not authorized"){
                toast.error("You need to be logged-in in to perform the action")
              }else{
                toast.success(data.msg)
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
            toast.success(data.msg)
            setCheckcart(false)
            setQty(0)
          }
        })
      }

    return(
        <div className="singleprod">
            <img src={obj.img} alt="pic" className="prod_img1" />
            <div className="prod_info">
                <p><strong>Brand:-</strong> {obj.brand}</p>
                <p><strong>Description:-</strong> {obj.descripion}</p>
                <p><strong>Color:-</strong> {obj.color}</p>
                <p><strong>Price:-</strong> {obj.price}</p>
                <div className="functional_part">
                {checkcart ? 
                    // if product in user cart show them appropriate action
                    <div className="if_in_cart">
                        <button onClick={removeFromCart} className="btn">Remove from Cart</button>
                        <p className="action">
                        Qty:-<RemoveIcon onClick={()=>inc_dec("dec")} className="icon_btn" /> {qty} <AddIcon onClick={()=>inc_dec("inc")} className="icon_btn" />
                        </p>
                    </div>
                    :
                    // if product is not in user cart show then appropriate action
                    <button onClick={addToCart} className="btn">Add to Cart</button> 
                }
                </div>
            </div>
        </div>
    )
}


// making state avaialable to component using react-redux binding so we can acess the login status of user from our component
const mapStateToProps = (state) => {
  return{
    loginStatus: state.isLoggedIn
  }
}

export default connect(mapStateToProps, null)(ProductPage)