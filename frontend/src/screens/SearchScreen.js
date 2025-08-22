import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Rating from "../components/Rating";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Button from "react-bootstrap/Button";
import Product from "../components/Product";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $200",
    value: "51-200",
  },
  {
    name: "$201 to $1000",
    value: "201-1000",
  },
];

export const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },

  {
    name: "3stars & up",
    rating: 3,
  },

  {
    name: "2starts & up",
    rating: 2,
  },

  {
    name: "1starts & up",
    rating: 1,
  },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const price = sp.get("price") || "all";
  const rating = sp.get("rating") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);

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
  }, [dispatch]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        {/* Sidebar */}
        <Col md={3} className="mb-4">
          <div className="p-3 bg-light rounded shadow-sm">
            {/* Categorías */}
            <h5 className="mb-3">Department</h5>
            <div className="list-group mb-4">
              <Link
                className={`list-group-item list-group-item-action ${
                  category === "all" ? "active" : ""
                }`}
                to={getFilterUrl({ category: "all" })}
              >
                Any
              </Link>
              {categories.map((c) => (
                <Link
                  key={c}
                  className={`list-group-item list-group-item-action ${
                    c === category ? "active" : ""
                  }`}
                  to={getFilterUrl({ category: c })}
                >
                  {c}
                </Link>
              ))}
            </div>

            {/* Precios */}
            <h5 className="mb-3">Price</h5>
            <div className="list-group mb-4">
              <Link
                className={`list-group-item list-group-item-action ${
                  price === "all" ? "active" : ""
                }`}
                to={getFilterUrl({ price: "all" })}
              >
                Any
              </Link>
              {prices.map((p) => (
                <Link
                  key={p.value}
                  className={`list-group-item list-group-item-action ${
                    p.value === price ? "active" : ""
                  }`}
                  to={getFilterUrl({ price: p.value })}
                >
                  {p.name}
                </Link>
              ))}
            </div>

            {/* Rating */}
            <h5 className="mb-3">Avg. Customer Review</h5>
            <div className="list-group">
              {ratings.map((r) => (
                <Link
                  key={r.name}
                  className={`list-group-item list-group-item-action ${
                    `${r.rating}` === `${rating}` ? "active" : ""
                  }`}
                  to={getFilterUrl({ rating: r.rating })}
                >
                  <Rating caption={" & up"} rating={r.rating}></Rating>
                </Link>
              ))}
              <Link
                className={`list-group-item list-group-item-action ${
                  rating === "all" ? "active" : ""
                }`}
                to={getFilterUrl({ rating: "all" })}
              >
                <Rating caption={" & up"} rating={0}></Rating>
              </Link>
            </div>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={9}>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              {/* Header */}
              <Row className="justify-content-between align-items-center mb-3">
                <Col md={6}>
                  <span className="fw-bold">
                    {countProducts === 0 ? "No" : countProducts} Results
                  </span>
                  {query !== "all" && ` : ${query}`}
                  {category !== "all" && ` : ${category}`}
                  {price !== "all" && ` : Price ${price}`}
                  {rating !== "all" && ` : Rating ${rating} & up`}

                  {(query !== "all" ||
                    category !== "all" ||
                    rating !== "all" ||
                    price !== "all") && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => navigate("/search")}
                    >
                      <i className="fas fa-times-circle"></i> Clear
                    </Button>
                  )}
                </Col>
                <Col className="text-end">
                  <label className="me-2 fw-semibold">Sort by</label>
                  <select
                    className="form-select d-inline-block w-auto"
                    value={order}
                    onChange={(e) =>
                      navigate(getFilterUrl({ order: e.target.value }))
                    }
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. Customer Reviews</option>
                  </select>
                </Col>
              </Row>

              {/* Products */}
              {products.length === 0 ? (
                <MessageBox>No Product Found</MessageBox>
              ) : (
                <Row>
                  {products.map((product) => (
                    <Col sm={6} lg={4} className="mb-4" key={product._id}>
                      <Product product={product}></Product>
                    </Col>
                  ))}
                </Row>
              )}

              {/* Pagination */}
              <div className="d-flex justify-content-center mt-4">
                <nav>
                  <ul className="pagination">
                    {[...Array(pages).keys()].map((x) => (
                      <li
                        key={x + 1}
                        className={`page-item ${
                          Number(page) === x + 1 ? "active" : ""
                        }`}
                      >
                        <Link
                          className="page-link"
                          to={getFilterUrl({ page: x + 1 })}
                        >
                          {x + 1}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
