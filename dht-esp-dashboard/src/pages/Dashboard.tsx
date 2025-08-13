import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, CardText, Container, Row, Col } from "react-bootstrap";
import Dropdown from "../components/DropdownComponent.tsx";
import { getAvailableDevices } from "../clients/device.tsx";
import type { Device } from "../models/Device.ts";
import { DhtChart, SelectedTimeRangeConfig, type SelectedTimeRangeConfigKey } from "../components/DhtChart.tsx";

interface DeviceDetailCardProps {
  device: Device;
}

function DeviceDetailCard({ device }: DeviceDetailCardProps) {
  return (
    <Card className="my-4 shadow-sm" style={{ minWidth: "300px", maxWidth: "600px" }}>
      <CardBody>
        <CardTitle as="h5" className="mb-4 text-center">
          {device.name}
        </CardTitle>

        <Row className="mb-3">
          <Col xs={5} className="text-muted fw-semibold">
            AWS Client Id:
          </Col>
          <Col xs={7}>{device.clientId}</Col>
        </Row>

        <Row className="mb-4">
          <Col xs={5} className="text-muted fw-semibold">
            Device Id:
          </Col>
          <Col xs={7}>{device.id}</Col>
        </Row>

        <hr />

        <CardText className="fw-semibold mb-3 text-center fs-6">
          Current Readings as of <span className="text-primary">Friday 23:49</span>
        </CardText>

        <Row className="text-center">
          <Col xs={6} className="border-end">
            <div className="fw-semibold fs-5 text-danger">30 °C</div>
            <div className="text-muted">Temperature</div>
          </Col>
          <Col xs={6}>
            <div className="fw-semibold fs-5 text-primary">60%</div>
            <div className="text-muted">Humidity</div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}

function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceName, setSelectedDeviceName] = useState<string>("");
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<SelectedTimeRangeConfigKey>("FifteenMinutes")

  useEffect(() => {
    getAvailableDevices().then(setDevices);
  }, []);

  useEffect(() => {
    const d = devices.find((device) => device.name === selectedDeviceName) ?? null;
    setSelectedDevice(d);
  }, [devices, selectedDeviceName]);

  return (
    <Container className="d-flex flex-column align-items-center mt-5" style={{ minWidth: "50vw" }}>
      <Row className="mb-4 w-100 justify-content-center">
        <Col xs={12} md={6}>
          <Dropdown
            items={devices.map((d) => ({
              key: d.name,
              label: d.name
            }))}
            selectedItem={selectedDeviceName}
            onSelectItem={setSelectedDeviceName}
          />
        </Col>
        <Col>
          <Dropdown
            items={Object.entries(SelectedTimeRangeConfig).map(([key, cfg]) => ({
              key,
              label: cfg.display,
            }))}
            selectedItem={selectedTimeRange}
            onSelectItem={setSelectedTimeRange}
          />
        </Col>
      </Row>

      {selectedDevice ? (
        <>
          <DeviceDetailCard device={selectedDevice} />

          <Row className="w-100 justify-content-center">
            <Col xs={12} md={8}>
              <DhtChart device={selectedDevice} timeRange={selectedTimeRange}/>
            </Col>
          </Row>
        </>
      ) : (
        <div className="text-muted">Please select a device</div>
      )}
    </Container>
  );
}

export default Dashboard;
