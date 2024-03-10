// simulate getting products from DataBase
import React from "react";
import Accordion from 'react-bootstrap/Accordion';
import AccordionItem from 'react-bootstrap/AccordionItem';
import AccordionBody from 'react-bootstrap/AccordionBody';
import AccordionHeader from 'react-bootstrap/AccordionHeader';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/CardGroup';
import Image from 'react-bootstrap/Image';
import Input from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import apple from './apple.png';
import beans from './beans.png';
import cabbage from './cabbage.png';
import orange from './orange.png';

const products = [
  { name: "Apples_:", country: "Italy", cost: 3, instock: 10 },
  { name: "Oranges:", country: "Spain", cost: 4, instock: 3 },
  { name: "Beans__:", country: "USA", cost: 2, instock: 5 },
  { name: "Cabbage:", country: "USA", cost: 1, instock: 8 },
];
//=========Cart=============
const Cart = (props) => {
  //const { Card, Accordion, Button } = ReactBootstrap;
  let data = props.location.data ? props.location.data : products;
  console.log(`data:${JSON.stringify(data)}`);

  return <Accordion defaultActiveKey="0">{props.list}</Accordion>;
};

const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });
  console.log(`useDataApi called`);
  useEffect(() => {
    console.log("useEffect Called");
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        console.log("FETCH FROM URl");
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const Products = (props) => {
  const [items, setItems] = React.useState(products);
  const [cart, setCart] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  //const {Card, Accordion, Button, Container, Row, Col, Image,Input} = ReactBootstrap;
  //  Fetch Data
  const {Fragment, useState, useEffect, useReducer, useCallback} = React;
  const [query, setQuery] = useState("http://localhost:1337/api/products");
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "http://localhost:1337/api/products",
    {
      data: [],
    }
  );
  console.log(`Rendering Products ${JSON.stringify(data)}`);
  // Fetch Data
  const addToCart = (e) => {
    let name = e.target.name;
    let item = items.filter((item) => item.name == name);
    console.log(`add to Cart ${JSON.stringify(item)}`);
    setCart([...cart, ...item]);
    //doFetch(query);
  };
  const deleteCartItem = (index) => {
    let newCart = cart.filter((item, i) => index != i);
    setCart(newCart);
  };
  const photos = [apple, orange, beans, cabbage];

  let list = items.map((item, index) => {
    //let n = index + 1049;
    //let url = "https://picsum.photos/id/" + n + "/50/50";

    return (
      <li key={index}>
        <Image src={photos[index % 4]} width={70} roundedCircle></Image>
        <Button className="prod-btn" variant="primary" size="large">
          {item.name}:{item.cost}
        </Button>
        <input className="prod-btn" name={item.name} type="submit" onClick={addToCart}></input>
      </li>
    );
  });
  let cartList = cart.map((item, index) => {
    return (
      <Accordion.Item key={1+index} eventKey={1 + index}>
      <Accordion.Header>
        {item.name}
      </Accordion.Header>
      <Accordion.Body onClick={() => deleteCartItem(index)}
        eventKey={1 + index}>
        $ {item.cost} from {item.country}
      </Accordion.Body>
    </Accordion.Item>
    );
  });

  let finalList = () => {
    let total = checkOut();
    let final = cart.map((item, index) => {
      return (
        <div key={index} index={index}>
          {item.name}
        </div>
      );
    });
    return { final, total };
  };

  const checkOut = () => {
    let costs = cart.map((item) => item.cost);
    const reducer = (accum, current) => accum + current;
    let newTotal = costs.reduce(reducer, 0);
    console.log(`total updated to ${newTotal}`);
    return newTotal;
  };
  // TODO: implement the restockProducts function
  
  const restockProducts = (evt) => {
    doFetch(query);
    return (
      <div>
        {isLoading &&<p>{isLoading}</p>}
        {isError &&<p>{isError}</p>}
        {data && <p>...Loading</p>}
      </div>
    );
    console.log(evt);
  };

  return (
    <div>
    <div className="products">
          <Accordion defaultActiveKey="0">
           <Accordion.Item eventKey={1}>
              <Accordion.Header>Product List</Accordion.Header> 
              <Accordion.Body style={{ listStyleType: "none" }}>{list}</Accordion.Body>
           </Accordion.Item>
           <Accordion.Item eventKey={2}>
           <Accordion.Header>Cart Contents</Accordion.Header> 
              <AccordionBody style={{ listStyleType: "none" }}>{cartList}</AccordionBody>
          </Accordion.Item>
          <Accordion.Item eventKey={3}>
            <Accordion.Header>CheckOut</Accordion.Header> 
              <Accordion.Body style={{ listStyleType: "none" }}>
                <Button onClick={checkOut}>CheckOut $ {finalList().total}</Button>
               <div> {finalList().total > 0 && finalList().final} </div></Accordion.Body>
          </Accordion.Item>
          </Accordion>
          </div>
        <form
          onSubmit={(event) => {
            restockProducts(event.target.value);
            console.log(`Restock called on ${query}`);
            event.preventDefault();
          }}
        >
          <input className="restock-input-btn"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="restock-btn" type="submit" onClick={(event) => {
            restockProducts(event);
            console.log(`Restock called on ${query}`);
            event.preventDefault();
          }}>ReStock Products</button>
        </form>
      </div>
 
  );
};
export default Products;
// ========================================
//ReactDOM.render(<Products />, document.getElementById("root"));
