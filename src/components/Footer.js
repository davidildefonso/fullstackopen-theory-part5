import React from 'react';
import styled from 'styled-components'

const FooterC = styled.div`
  background: Chocolate;
  padding: 1em;
  margin-top: 1em;
`


const Footer = () => {
 
 
  return (
    <FooterC >
     
      <em>Note app, Department of Computer Science, University of Helsinki 2021</em>
    </FooterC>
  )
}

export default Footer;