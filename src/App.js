import './App.css';
import {Routes, Route} from "react-router-dom";
import Login from './Components/LOGIN/Login';
import Createaccount from './Components/CREATE_ACCOUNT/Create_Account';
import Home from './Components/Home/Home';
import ProductPage from './Components/Product_Page/Product_page';
import Cart from './Components/Cart/Cart';
import {store} from "./Components/Redux/store"
import { Provider } from 'react-redux';


function App() {
  return (
    <Provider store={store} >
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Createaccount />} />
          <Route path="/" element={<Home />} />
          <Route path="/product-page/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
