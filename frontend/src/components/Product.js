import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../Store";

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  return (
    <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
      <Link to={`/product/${product.slug}`}>
        <div className="overflow-hidden">
          <Card.Img
            variant="top"
            src={product.image}
            alt={product.name}
            className="img-fluid rounded-0"
            style={{ transition: "transform 0.3s ease" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>
      </Link>

      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Link
            to={`/product/${product.slug}`}
            className="text-decoration-none text-dark"
          >
            <Card.Title className="fw-semibold fs-5 mb-2 text-truncate">
              {product.name}
            </Card.Title>
          </Link>
          <Rating rating={product.rating} numReviews={product.numReviews} />
          <Card.Text className="fw-bold fs-5 mt-2 text-primary">
            ${product.price}
          </Card.Text>
        </div>

        {product.countInStock === 0 ? (
          <Button variant="outline-secondary" className="mt-3 w-100" disabled>
            Out of stock
          </Button>
        ) : (
          <Button
            onClick={() => addToCartHandler(product)}
            variant="primary"
            className="mt-3 w-100 rounded-pill fw-semibold"
          >
            Add to cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Product;
