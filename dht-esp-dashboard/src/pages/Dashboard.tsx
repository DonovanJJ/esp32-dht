import { useEffect, useState } from "react";
import {Card, CardBody, CardTitle, Container, Row, Col, CardText} from "react-bootstrap";
import Dropdown from "../components/DropdownComponent.tsx";
import { getAvailableDevices } from "../clients/device.tsx";
import type { Device } from "../models/Device.ts";
import { DhtChart, type SelectedTimeRangeConfigKey } from "../components/DhtChart.tsx";
import { getLatestTelemetry } from "../clients/telemetry.tsx";
import type {Telemetry} from "../models/Telemetry.ts";
import {SelectedTimeRangeConfig} from "../components/SelectedTimeRangeConfig.tsx";

interface DeviceDetailCardProps {
  device: Device;
  telemetry?: Telemetry;
}

function DeviceDetailCard({ device, telemetry }: DeviceDetailCardProps) {
  return (
    <Card className="my-4 shadow-sm w-100 h-100">
      <CardBody>
        <CardTitle as="h5" className="mb-4 text-center fw-bold">
          {device.name}
        </CardTitle>

        <Row className="mb-3">
          <Col xs={5} className="text-muted fw-semibold">
            AWS Client Id:
          </Col>
          <Col xs={7} className="text-break">{device.clientId}</Col>
        </Row>

        <Row className="mb-4">
          <Col xs={5} className="text-muted fw-semibold">
            Device Id:
          </Col>
          <Col xs={7} className="text-break">{device.id}</Col>
        </Row>

        <hr />

        {telemetry ? (
          <>
            <CardText className="fw-semibold mb-3 text-center fs-6">
              As of{" "}
              <span className="text-primary">
                {new Date(telemetry.timestamp).toLocaleString()}
              </span>
            </CardText>

            <Row className="text-center">
              <Col xs={6} className="border-end">
                <div className="fw-bold fs-4 text-danger">
                  🌡 {telemetry.temperature} °C
                </div>
                <div className="text-muted small">Temperature</div>
              </Col>
              <Col xs={6}>
                <div className="fw-bold fs-4 text-primary">
                  💧 {telemetry.humidity}%
                </div>
                <div className="text-muted small">Humidity</div>
              </Col>
            </Row>
          </>
        ) : (
          <div className="text-muted text-center">No Telemetry data detected</div>
        )}
      </CardBody>
    </Card>
  );
}

function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceName, setSelectedDeviceName] = useState<string>("");
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<SelectedTimeRangeConfigKey>("FifteenMinutes")
  const [latestTelemetry, setLatestTelemetry] = useState<Telemetry>();

  useEffect(() => {
    getAvailableDevices().then(data => setDevices(data));
  }, []);

  useEffect(() => {
    const d = devices.find((device) => device.name === selectedDeviceName) ?? null;
    setSelectedDevice(d);
  }, [devices, selectedDeviceName]);

  useEffect(() => {
    if (selectedDevice) {
      getLatestTelemetry(selectedDevice.id).then((data) => data && setLatestTelemetry(data));
    }
  }, [selectedDevice]);

  return (
    <Container fluid className="mt-4">
      <Card className="shadow-sm border-0 bg-light p-3 mb-4">
        <Row className="gy-2 gx-3 justify-content-center align-items-center">
          <Col xs={12} sm={6} md={4} lg={3}>
            <div className="mb-1 text-muted small fw-semibold">Device</div>
            <Dropdown
              items={devices.map((d) => ({
                key: d.name,
                label: d.name
              }))}
              selectedItem={selectedDeviceName}
              onSelectItem={setSelectedDeviceName}
              defaultText="Select a device"
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <div className="mb-1 text-muted small fw-semibold">Time Range</div>
            <Dropdown
              items={Object.entries(SelectedTimeRangeConfig).map(([key, cfg]) => ({
                key,
                label: cfg.display,
              }))}
              selectedItem={selectedTimeRange}
              onSelectItem={setSelectedTimeRange}
              defaultText="Select a time range"
            />
          </Col>
        </Row>
      </Card>

      {/* Device card & chart */}
      {selectedDevice ? (
        <Row className="gy-4 justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6}>
            <DeviceDetailCard device={selectedDevice} telemetry={latestTelemetry}/>
          </Col>
          <Col xs={12} sm={11} md={10} lg={8}>
            <Card className="shadow-sm p-3">
              <div style={{ height: "350px" }}>
                <DhtChart device={selectedDevice} timeRange={selectedTimeRange}/>
              </div>
            </Card>
          </Col>
        </Row>
      ) : (
        <div className="text-center text-muted my-5">
          <p className="fs-5">🔌 No device selected</p>
          <p>Select a device from the dropdown above to see details</p>
        </div>
      )}
    </Container>
  );
}

export default Dashboard;
