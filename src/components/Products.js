import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wait, setWait] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(500);
  const [searchValue, setSearchValue] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  useEffect(() => {
    performAPICall();
    fetchCart(token);
    isItemInCart(cart, "asfsdfsjdfg");
  }, []);
  const performAPICall = async () => {
    try {
      setWait(true);
      let result = await axios.get(`${config.endpoint}/products`);
      if (result.status === 200) {
        setWait(false);
        setProducts([...products, ...result.data]);
      }
    } catch (err) {
      setWait(false);
      enqueueSnackbar(
        "Something went wrong. Check the backend console for more details",
        {
          variant: "error",
        }
      );
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */

  const performSearch = async (text) => {
    try {
      const result = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      if (result.status === 200) {
        setProducts([...result.data]);
        return result.data;
      }
    } catch (err) {
      setProducts([]);
      if (err.response.status === 404) {
        return err.response.data;
      } else {
        enqueueSnackbar(
          "Something went wrong. Check the backend console for more details",
          {
            variant: "error",
          }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    setSearchValue(value);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      performSearch(value);
    }, 500);

    setDebounceTimeout(timeout);
  };
  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let response = await axios.get(`${config.endpoint}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart([...cart, ...response.data]);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    let product;
    if (items?.length > 0) {
      product = items.find((item) => item.productId === productId);
    }
    return product ? true : false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    }
    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "warning",
        }
      );
      return;
    }
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let response = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (isItemInCart(items, productId) && qty > 0) {
        let newCart = [];
        cart.map((item) => {
          if (item.productId === productId) {
            item.qty = qty;
          }
          newCart.push(item);
          return item;
        });
        setCart([...newCart]);
      } else {
        let product = products.find(product=>product._id===productId);
        if(product && qty!==0){
          product["productId"] = productId;
          product["qty"] = qty;
          delete product._id;
          cart.push(product);
          //setCart([{ productId: "KCRwjF7lN97HnEaY", qty: 1 }]);
          setCart([...cart]);
        }else{
          let newCart=cart.filter(item=>item.productId!==productId);
          setCart([...newCart])
        }
      }
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  return (
    <div>
      <Header>
        searchValue={searchValue}
        onChange={(e) => debounceSearch(e, debounceTimeout)}
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        value={searchValue}
        onChange={(e) => debounceSearch(e, debounceTimeout)}
      />
      {username ? (
        <Grid container>
          <Grid item sm={12} md={9}>
            <Grid container spacing={2}>
              <Grid item className="product-grid">
                <Box className="hero">
                  <p className="hero-heading">
                    India’s{" "}
                    <span className="hero-highlight">FASTEST DELIVERY</span> to
                    your door step
                  </p>
                </Box>
              </Grid>
              {wait ? (
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "50vh",
                    width: "100vw",
                  }}
                >
                  <CircularProgress />
                  <Typography variant="body2" color="text-secondary">
                    loading Products...
                  </Typography>
                </Box>
              ) : null}
              {products.length > 0 ? (
                products.map((product) => (
                  <Grid
                    key={product._id}
                    item
                    xs={6}
                    md={3}
                    className="product-grid"
                  >
                    <ProductCard
                      product={product}
                      token={token}
                      items={cart}
                      products={products}
                      productId={product._id}
                      handleAddToCart={addToCart}
                    />
                  </Grid>
                ))
              ) : (
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "50vh",
                    width: "100vw",
                  }}
                >
                  <SentimentDissatisfied />
                  <br />
                  <Typography variant="body2" color="text-secondary">
                    No products found
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
          <Grid item sm={12} md={3}>
            <Cart products={products} items={cart} handleQuantity={addToCart} />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>
          {wait ? (
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "50vh",
                width: "100vw",
              }}
            >
              <CircularProgress />
              <Typography variant="body2" color="text-secondary">
                loading Products...
              </Typography>
            </Box>
          ) : null}
          {products.length > 0 ? (
            products.map((product) => (
              <Grid
                key={product._id}
                item
                xs={6}
                md={3}
                className="product-grid"
              >
                <ProductCard
                  product={product}
                  token={token}
                  items={cart}
                  products={products}
                  productId={product._id}
                  handleAddToCart={addToCart}
                />
              </Grid>
            ))
          ) : (
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "50vh",
                width: "100vw",
              }}
            >
              <SentimentDissatisfied />
              <br />
              <Typography variant="body2" color="text-secondary">
                No products found
              </Typography>
            </Box>
          )}
        </Grid>
      )}
      <Footer />
    </div>
  );
};

export default Products;
