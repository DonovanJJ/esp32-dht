import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, CardText, Container, Row, Col } from "react-bootstrap";
import Dropdown from "../components/DropdownComponent.tsx";
import { getAvailableDevices } from "../clients/device.tsx";
import type { Device } from "../models/Device.ts";
import { DhtChart } from "../components/DhtChart.tsx";

interface DeviceDetailCardProps {
  device: Device;
}

function DeviceDetailCard({ device }: DeviceDetailCardProps) {
  return (
    <Card className="my-4 shadow-sm" style={{ minWidth: "300px", maxWidth: "600px" }}>
      <CardBody>
        <CardTitle as="h5" className="mb-3">{device.name}</CardTitle>
        <CardText>
          <strong>AWS Client Id:</strong> <span>{device.clientId}</span>
        </CardText>
        <CardText>
          <strong>Device Id:</strong> <span>{device.id}</span>
        </CardText>
      </CardBody>
    </Card>
  );
}

function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceName, setSelectedDeviceName] = useState<string>("");
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

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
            items={devices.map((d) => d.name)}
            selectedItem={selectedDeviceName}
            onSelectItem={setSelectedDeviceName}
          />
        </Col>
      </Row>

      {selectedDevice ? (
        <>
          <DeviceDetailCard device={selectedDevice} />

          <Row className="w-100 justify-content-center">
            <Col xs={12} md={8}>
              <DhtChart device={selectedDevice}/>
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
