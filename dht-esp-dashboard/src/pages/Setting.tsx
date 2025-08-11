import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import type {Device} from "../models/Device.ts";

type DeviceFormProp = {
  device: Device;
}

function DeviceForm({ device: Device }: DeviceFormProp) {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Device Name</Form.Label>
        <Form.Control type="email" placeholder="Enter device name" />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export function Setting() {
  return (
    // <div className={"flex flex-column align-items-center"}>
    //   <DeviceForm />
    // </div>
    <div>In Development</div>
  )
}