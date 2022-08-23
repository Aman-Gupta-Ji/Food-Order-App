import React, { useCallback, useContext } from "react";

import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Modal from "../UI/Modal";
import CheckOut from "./CheckOut";
import classes from "./Cart.module.css";

const Cart = (props) => {
  const [isCheckOut, setIsCheckOut] = React.useState(false);
  const cartCtx = useContext(CartContext);

  const totalAmount = cartCtx.totalAmount.toFixed(2);

  const hasItems = cartCtx.items.length > 0;

  const { removeItem, addItem } = cartCtx;

  const cartItemRemoveHandler = useCallback(
    (id) => {
      removeItem(id);
    },
    [removeItem]
  );

  const cardItemsAddHandler = useCallback(
    (item) => {
      addItem({ ...item, amount: 1 });
    },
    [addItem]
  );

  const cardItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cardItemsAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const orderHandler = () => {
    setIsCheckOut(true);
  };

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes["button"]} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  return (
    <Modal onClose={props.onClose}>
      {cardItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckOut && <CheckOut onCancel={props.onClose} />}
      {!isCheckOut && modalActions}
    </Modal>
  );
};

export default Cart;
