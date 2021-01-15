import { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

import styled from "styled-components";
import "antd/dist/antd.css";
import { RadioChangeEvent } from "antd/lib/radio";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styles from "../styles/Login.module.css";
import { Form, Input, Button, Checkbox, Radio, Row, Col } from "antd";

//A mock server which return the login state
import { createServer } from "miragejs";
import { stringify } from "querystring";

createServer({
  routes() {
    this.get("/api/login", () => ({
      code: 0,
      msg: "success",
      data: {
        token: "12xxxdsf",
        role: "12154545",
      },
    }));

    this.passthrough();
  },
});

export const StyledButton = styled(Button)`
  &&& {
    width: 100%;
  }
`;

export interface LoginFormValues {
  username: String;
  password: String;
  role: String;
  remember: Boolean;
}

/*async function loginState(values:LoginFormValues) {
  
  await axios.get("http://localhost:3000/api/login", {
    params: {
      email: values.username,
      password: values.password,
      role: values.role,
      remember: values.remember
    },
    timeout: 1000,
  }).then(res => {
    if(res.data.msg === "success") {
      return "success";
    }
  })
}*/

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = (values: LoginFormValues) => {

    axios
      .get("http://localhost:3000/api/login", {
        params: {
          email: values.username,
          password: values.password,
          role: values.role,
          remember: values.remember,
        },
        timeout: 1000,
      })
      .then((res) => {
        const storageInfo = JSON.stringify(res.data);
        localStorage.setItem('storageInfo',storageInfo);

        if (res.data.msg === "success") {
          if (values.role === "Student") {
            router.push("/dashboard/student");
          } else if (values.role === "Manager") {
            router.push("/dashboard/manager");
          } else if (values.role === "Teacher") {
            router.push("/dashboard/teacher");
          }
        }
      });

  };

  const onFinishFailed = (errorInfo: any) => {
    alert("Failed, please check your username and password");
  };

  //form.item你不再需要也不应该用 onChange 来做数据收集同步（你可以使用 Form 的 onValuesChange），但还是可以继续监听 onChange 事件。

  return (
    <Fragment>
      <h1 className={styles.title}>COURSE MANAGEMENT ASSISTANT</h1>
      <Row justify="center">
        <Col md={8} sm={24}>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={form}
          >
            <Form.Item
              name="role"
              initialValue={"Student"}
              rules={[{ required: true }]}
            >
              <Radio.Group className={styles.radio} buttonStyle="solid">
                <Radio.Button value="Student">Student</Radio.Button>
                <Radio.Button value="Teacher">Teacher</Radio.Button>
                <Radio.Button value="Manager">Manager</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
                {
                  type: "email",
                  message: "Please fill in correct email",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  min: 4,
                  max: 16,
                  message:
                    "Password must be at least 4 characters and no more than 16 characters",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <StyledButton type="primary" htmlType="submit">
                Sign in
              </StyledButton>
            </Form.Item>
          </Form>

          <div>
            <span>No Account? </span>
            <Link href="/signup">Sign up</Link>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
}
