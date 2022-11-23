import { useState } from "react"
import "./Cart.css"
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// DIalog box if the user is not looged-in
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Navbar from "../Navbar/Navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { styled } from "@mui/material";
import { connect } from "react-redux";
import { dec_cart_creator, inc_cart_creator } from "../Redux/action_creator";


// const base_url = "http://localhost:5000";
const base_url = "https://opt-out-task.herokuapp.com"


const MyCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column"
})

const MyCartActions = styled(CardActions)({
  display: "flex",
  flexDirection: "column",
  gap: "10px"
})

function Cart({dec_cart}) {
    const navigate = useNavigate();
    // Variable to store the products in user's cart
    const[prodincart, setProdincart] = useState(null);
    // Open the dialog if not logged-in
    const[open, setOpen] = useState(false);
    // to fire the useeffect by updating the dependancy whwnever a product is remoced from cart or quantity is updated
    const[depcy, setDepcy] = useState(true);
    // To close the dailog box
    const handleClose = () => {
        setOpen(false)
    }

    useEffect(()=>{
        // get all the products in user's cart
        fetch(`${base_url}/cart/all-product-in-user-cart/${localStorage.getItem("uuid")}`,{
            method: "GET",
            headers: {
                "content-type" : "application/json",
                "x-auth-token" : localStorage.getItem("token")
            }
        }).then((data) => data.json()).then((data) => {
            if(data.msg === "You are not authorized"){
                // open the dailog box
                setOpen(true)
            }else{
                // store the response
                setProdincart(data)
            }
        })
    }, [depcy])

  return (
    <div>
      <Navbar />
      <div>
          {
              prodincart ?
                  <div>
                      {
                          prodincart[0] ?
                              <div>
                                  <div className="main_cart_cont">
                                      {prodincart.map((ele, index) => <IndividualProduct depcy={depcy} setDepcy={setDepcy} key={index} obj={ele} dec_cart={dec_cart} />)}
                                  </div>
                                  {/* using reduce method on an array of products in user's cart */}
                                  <p><strong>Total Cart Value:- ₹ {prodincart.reduce((tot, curr) => tot+= curr.qty*curr.product_info.price ,0)}</strong></p>
                              </div>
                              :
                              <div>
                                  <p>You do not have any products added to your cart</p>
                                  <button onClick={()=> navigate("/")} className="btn">Go to home</button>
                              </div>
                      }
                  </div>
                  :
                  <p>Loading all products in your cart...</p>
          }
          {/* Dialog box opens up if user is not logged-in */}
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
                              <Button onClick={() => navigate("/")} variant="contained">Go to Home</Button>
                              <Button onClick={() => navigate("/login")} variant="contained">Go to Log-in</Button>
                          </div>
                      </DialogContentText>
                  </DialogContent>
          </Dialog>
      </div>
      <ToastContainer />
    </div>
  )
}


function IndividualProduct({obj, depcy, setDepcy, dec_cart}){
    const navigate = useNavigate();

    const[qty, setQty] = useState(Number(obj.qty))
    
      function inc_dec(arg){
        if(arg==="inc"){
          // fetch call to increment count in DB side
          fetch(`${base_url}/cart/inc-dec-qty?u_id=${localStorage.getItem("uuid")}&prod_id=${obj.product_info._id}&action=inc&qty=${qty+1}`,{
            method: "GET",
            headers: {
              "content-type" : "application/json",
              "x-auth-token" : localStorage.getItem("token")
            }
          }).then((data) => data.json()).then((data) => {
            if(data.msg === "You are not authorized"){
              alert("You need to be logged-in in to perform the action")
            }else{
            // Updating the dependancy to run the callback in useEffcet again & get the updated data by re-rendering
              toast.success(data.msg)
              setDepcy(!depcy);
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
            fetch(`${base_url}/cart/inc-dec-qty?u_id=${localStorage.getItem("uuid")}&prod_id=${obj.product_info._id}&action=dec&qty=${qty-1}`,{
              method: "GET",
              headers: {
                "content-type" : "application/json",
                "x-auth-token" : localStorage.getItem("token")
              }
            }).then((data) => data.json()).then((data) => {
              if(data.msg === "You are not authorized"){
                alert("You need to be logged-in in to perform the action")
              }else{
                // Updating the dependancy to run the callback in useEffcet again & get the updated data by re-rendering
                toast.success(data.msg);
                setDepcy(!depcy);
                setQty(qty-1);
              }
            })
          }
        }
      }
    
      function removeFromCart(){
        // fetch call to remove from cart
        fetch(`${base_url}/cart/remove-from-cart?u_id=${localStorage.getItem("uuid")}&prod_id=${obj.product_info._id}`, {
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
            // Updating the dependancy to run the callback in useEffcet again & get the updated data by re-rendering
            toast.success(data.msg);
            setDepcy(!depcy);
            // update the redux-store tracking the number of products in user cart
            dec_cart();
          }
        })
      }
    
      function goToSpecificProduct(){
        // Navigate to specific product page
        navigate(`/product-page/${obj.product_info._id}`)
      }
      
      return(
        // Product card using custom CSS
        
        // <div title="Click to go to product specific page" className="card">
        //   <img onClick={goToSpecificProduct} src={obj.product_info.img} alt={obj.product_info.brand} className="prod_img" />
        //   <h5 onClick={goToSpecificProduct} className="brand">{obj.product_info.brand}</h5>
        //   <p onClick={goToSpecificProduct} className="des">{obj.product_info.descripion}</p>
        //   <p onClick={goToSpecificProduct} className="price">₹ {obj.product_info.price}</p>
        //     <div className="if_in_cart">
        //         <Button onClick={removeFromCart} className="btn">Remove from Cart</Button>
        //         <p className="action">
        //             Qty:-<RemoveIcon onClick={()=>inc_dec("dec")} className="icon_btn" /> {obj.qty} <AddIcon onClick={()=>inc_dec("inc")} className="icon_btn" />
        //         </p>
        //     </div>
        // </div>


        // Product card using MUI
      <Card title="Click to go to product specific page" sx={{ maxWidth: 170 }}>
        <CardMedia
          onClick={goToSpecificProduct}
          component="img"
          image={obj.product_info.img}
          alt={obj.product_info.brand}
          height="200"
        />
        <MyCardContent>
          <Typography onClick={goToSpecificProduct} sx={{textAlign: "center"}} gutterBottom variant="h6" component="div">{obj.product_info.brand}</Typography>
          <Typography onClick={goToSpecificProduct} sx={{textAlign: "center"}} gutterBottom variant="p" >{obj.product_info.descripion}</Typography>
          <Typography onClick={goToSpecificProduct} sx={{textAlign: "center"}} gutterBottom variant="p" >₹ {obj.product_info.price}</Typography>
        </MyCardContent>
        <MyCartActions>
          <Button variant="contained" onClick={removeFromCart} className="btn">Remove from Cart</Button>
          <p className="action">
            Qty:-<RemoveIcon onClick={()=>inc_dec("dec")} className="icon_btn" /> {obj.qty} <AddIcon onClick={()=>inc_dec("inc")} className="icon_btn" />
          </p>
        </MyCartActions>
      </Card>
      )
}


const mapDispatchToProps = (dispatch) => {
  return{
    dec_cart : () => dispatch(dec_cart_creator())
  }
}


export default connect(null, mapDispatchToProps)(Cart)