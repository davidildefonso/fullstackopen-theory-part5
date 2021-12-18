import React  from "react";
import {  Alert  } from '@material-ui/lab'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
     <Alert severity={message.type}>
      {message.content}
    </Alert>
  )
}


export default Notification;

