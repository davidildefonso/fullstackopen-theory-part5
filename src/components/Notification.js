import React  from "react";
import {  Alert  } from 'react-bootstrap'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
     <Alert variant={message.type}>
      {message.content}
    </Alert>
  )
}


export default Notification;

