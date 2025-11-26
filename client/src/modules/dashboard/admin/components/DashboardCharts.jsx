import { Row, Col } from "react-bootstrap";
import PieChartIssues from "./PieChartIssues";
import BarChartStatus from "./BarChartStatus";
import LineChartGrowth from "./LineChartGrowth";

export default function DashboardCharts({ issues }) {
  return (
    <Row className="mb-4">
      <Col md={6} className="mb-3">
        <PieChartIssues issues={issues} />
      </Col>
      <Col md={6} className="mb-3">
        <LineChartGrowth issues={issues} />
      </Col>
      <Col md={12} className="mb-3">
        <BarChartStatus issues={issues} />
      </Col>
    </Row>
  );
}
