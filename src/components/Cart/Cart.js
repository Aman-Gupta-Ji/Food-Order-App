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

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [didSubmit, setDidSubmit] = React.useState(false);

  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);
    const response = await fetch(
      "https://react-http-926be-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json",
      {
        method: "POST",
        body: JSON.stringify({
          user: userData,
          orderedItems: cartCtx.items,
          totalAmount: cartCtx.totalAmount,
        }),
      }
    );
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
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

  const cartModelContent = (
    <React.Fragment>
      {cardItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckOut && (
        <CheckOut onConfirm={submitOrderHandler} onCancel={props.onClose} />
      )}
      {!isCheckOut && modalActions}
    </React.Fragment>
  );

  const isSubmittingModelContent = <h3>Placing your order...</h3>;

  const didSubmitModelContent = (
    <React.Fragment>
      <h3>Order Placed Succesfully :)</h3>
      <div className={classes.actions}>
        <button className={classes["button"]} onClick={props.onClose}>
          Close
        </button>
      </div>
    </React.Fragment>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && cartModelContent}
      {isSubmitting && isSubmittingModelContent}
      {didSubmit && !isSubmitting && didSubmitModelContent}
    </Modal>
  );
};

export default Cart;
