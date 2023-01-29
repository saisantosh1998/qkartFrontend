import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart, token, items, products, productId}) => {
  return (
    <Card className="card">
      <CardMedia
        component="img"
        height="194"
        image={product.image}
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {product.name}
        </Typography><br />
        <Typography variant="body2" color="text.secondary">
          {'$'+product.cost}
        </Typography><br />
        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions >
        <Button variant="contained" sx={{width:"100%"}} onClick={()=>handleAddToCart(token,items,products,productId,1,{ preventDuplicate: true })}>
          <AddShoppingCartOutlined /> ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
