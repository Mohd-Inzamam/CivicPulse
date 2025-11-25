import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Button, Typography, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div style={{ background: "#f7f9fc", minHeight: "100vh" }}>
      <Container>
        {/* HERO */}
        <Row className="align-items-center mt-5">
          <Col md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}>
              <Typography variant="h2" fontWeight={700} gutterBottom>
                CivicPulse
              </Typography>
              <Typography variant="h5" color="text.secondary">
                Empowering communities by making civic issue reporting simple,
                transparent, and collaborative.
              </Typography>

              <Button
                variant="contained"
                size="large"
                sx={{ mt: 3, borderRadius: 2 }}
                href="/issues">
                View Issues
              </Button>
            </motion.div>
          </Col>

          <Col md={6}>
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src="/hero-illustration.png"
              alt="CivicPulse"
              className="img-fluid"
            />
          </Col>
        </Row>

        {/* MANIFESTO */}
        <Row className="mt-5 pt-5">
          <Col>
            <Typography variant="h4" fontWeight={600} align="center">
              Our Manifesto
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              color="text.secondary"
              className="mt-2">
              CivicPulse exists to bring transparency, accountability, and speed
              to civic issue resolution.
            </Typography>
          </Col>
        </Row>

        <Row className="mt-4">
          {[
            {
              title: "Transparency",
              text: "Every issue stays visible from report to resolution.",
            },
            {
              title: "Community-Driven",
              text: "Citizens work together to improve local environments.",
            },
            {
              title: "Accountability",
              text: "Authorities have a clear, public record of their actions.",
            },
          ].map((item, idx) => (
            <Col md={4} className="mt-4" key={idx}>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                <Card sx={{ borderRadius: 3, p: 1 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.text}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* HOW IT WORKS */}
        <Row className="mt-5 pt-5">
          <Col>
            <Typography variant="h4" fontWeight={600} align="center">
              How CivicPulse Works
            </Typography>
          </Col>
        </Row>

        <Row className="mt-4">
          {[
            "Report issues in your locality",
            "Authorities verify and respond",
            "Track progress transparently",
          ].map((step, index) => (
            <Col md={4} className="mt-3" key={index}>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                <Card sx={{ borderRadius: 3, textAlign: "center", p: 2 }}>
                  <CardContent>
                    <Typography variant="h5" fontWeight={700}>
                      {index + 1}
                    </Typography>
                    <Typography variant="body1" className="mt-2">
                      {step}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* CTA */}
        <Row className="mt-5 text-center pb-5">
          <Col>
            <Button
              variant="contained"
              size="large"
              sx={{ borderRadius: 3 }}
              href="/issues">
              Report an Issue
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
