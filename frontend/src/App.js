import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import { Suspense, useContext, useEffect, useState } from "react";
import { Store } from "./Store";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignupScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import Button from "react-bootstrap/esm/Button";
import { getError } from "./utils";
import axios from "axios";
import SearchBox from "./components/SearchBox";
import SearchScreen from "./screens/SearchScreen";
import LoadingBox from "./components/LoadingBox";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? "d-flex flex-column site-container active-cont"
            : "d-flex flex-column site-container"
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>A-STORE</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basics-navbar-nav"></Navbar.Toggle>
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column shadow-lg bg-dark"
              : "side-navbar d-flex justify-content-between flex-wrap flex-column shadow-lg bg-dark"
          }
          style={{
            color: "white",
            minHeight: "100vh",
            position: "fixed",
            transition: "all 0.3s ease",
          }}
        >
          <Nav className="flex-column w-100 p-3">
            <Nav.Item className="mb-3 border-bottom pb-2">
              <strong className="fs-5 text-uppercase tracking-wide">
                Categories
              </strong>
            </Nav.Item>

            {categories.map((category) => (
              <Nav.Item key={category} className="mb-2">
                <LinkContainer
                  to={{
                    pathname: "/search",
                    hash: "#hash",
                    search: `?category=${category}`,
                  }}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link
                    className="text-white rounded px-3 py-2 fw-semibold"
                    style={{
                      transition: "background 0.2s ease, transform 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.2)";
                      e.currentTarget.style.transform = "translateX(5px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    {category}
                  </Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>

        <main>
          <Container className="mt-3">
            <Suspense fallback={<LoadingBox />}>
              <Routes>
                <Route path="/product/:slug" element={<ProductScreen />} />
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/search" element={<SearchScreen />} />
                <Route path="/signin" element={<SigninScreen />} />
                <Route path="/signup" element={<SignupScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route
                  path="/placeorder"
                  element={<PlaceOrderScreen />}
                ></Route>
                <Route path="/order/:id" element={<OrderScreen />}></Route>
                <Route
                  path="/orderhistory"
                  element={<OrderHistoryScreen></OrderHistoryScreen>}
                ></Route>
                <Route path="/shipping" element={<ShippingAddressScreen />} />
                <Route
                  path="/payment"
                  element={<PaymentMethodScreen />}
                ></Route>
                <Route path="/" element={<HomeScreen />} />
              </Routes>
            </Suspense>
          </Container>
        </main>
        <footer
          className="bg-dark text-light py-4 mt-5 shadow-sm"
          style={{ borderTop: "2px solid rgba(255,255,255,0.1)" }}
        >
          <div className="container text-center">
            <p className="mb-2 fw-semibold">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
