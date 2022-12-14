import React, { useContext, useEffect, useMemo, useState } from "react";

import classes from "./HeaderCartButton.module.css";
import CartIcon from "../../assets/CartIcon";
import CartContext from "../../store/cart-context";

function HeaderCartButton(props) {
  const [buttonHighlight, setButtonHighlight] = useState(false);

  const cartCtx = useContext(CartContext);
  const { items } = cartCtx;

  const numberOfCartItems = useMemo(() => {
    return items.reduce((acc, item) => {
      return acc + item.amount;
    }, 0);
  },[items]);

  const buttonClasses = `${classes.button} ${
    buttonHighlight ? classes.bump : ""
  }`;

  useEffect(() => {
    if (items.length === 0) {
      return;
    }
    setButtonHighlight(true);
    const timer = setTimeout(() => {
      setButtonHighlight(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [items]);

  return (
    <button className={buttonClasses} onClick={props.onClick}>
      <span className={classes.icon}>
        <CartIcon />
      </span>
      <span>Your Cart</span>
      <span className={classes["badge"]}>{numberOfCartItems}</span>
    </button>
  );
}

export default React.memo(HeaderCartButton);
