import { Form, Input, Button, Checkbox, Radio } from "antd";
import { Fragment } from "react";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function Demo() {
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Fragment>
      <h1>COURSE MANAGEMENT ASSISTANT</h1>
      <Radio.Group defaultValue="Student" buttonStyle="solid">
        <Radio.Button value="Student">Student</Radio.Button>
        <Radio.Button value="Teacher">Teacher</Radio.Button>
        <Radio.Button value="Manager">Manager</Radio.Button>
      </Radio.Group>

      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Sign in
          </Button>
        </Form.Item>

        <Form.Item {...tailLayout}>
          No Account? <a>Sign up</a>
        </Form.Item>
      </Form>
    </Fragment>
  );
}
