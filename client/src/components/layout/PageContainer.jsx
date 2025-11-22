import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const PageContainer = ({
  children,
  maxWidth = 'lg',
  className = '',
  fluid = false,
  ...props
}) => {
  return (
    <Container fluid={fluid} maxWidth={maxWidth} className={className} {...props}>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default PageContainer;
