import React from 'react';
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import '/src/Components/Card/Cards.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route,useNavigate } from 'react-router-dom';




function Cards  ()  {
  const navigate=useNavigate();
 
  const handleClick =()=> {
    
      navigate('/Problem1');
  }
  
  const handleClick2 =()=> {
    navigate('/Problem2');
  }


  return ( <>
    
    <Row>
      <Col className="sm=6">
        <Card body>
          <CardTitle>Special Title Treatment</CardTitle>
          <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
          <Button onClick={handleClick}>Go to Problem 1 </Button>
        </Card>
      </Col>
      <Col className="sm=6">
        <Card body>
          <CardTitle>Special Title Treatment</CardTitle>
          <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
          <Button onClick={handleClick2}>Go to Problem 2 </Button>
        </Card>
      </Col>
    </Row>
    
    </>
  );
};

export default Cards;