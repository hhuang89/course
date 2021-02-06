import { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import "antd/dist/antd.css";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styles from "../styles/Login.module.css";
import { Form, Input, Button, Checkbox, Radio, Row, Col, message } from "antd";

import { AES } from "crypto-js";
import { postLoginForm } from "../lib/services/api-services";

export interface LoginFormValues {
  username: string;
  password: string;
  role: string;
  remember: Boolean;
}

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: LoginFormValues) => {
    await postLoginForm(values).then((res) => {
      localStorage.setItem("token", JSON.stringify(res.data.token));
      if (res.code >= 200 && res.code < 300) {
        router.push(`/dashboard/${res.data.role}`);
      }
    });
    // await axios
    //   .post("https://cms.chtoma.com/api/login", {
    //     email: values.username,
    //     password: AES.encrypt(values.password, "cms").toString(),
    //     role: values.role,
    //   })
    //   .then((result) => {
    //     localStorage.setItem("token", JSON.stringify(result.data.data.token));
    //     if (result.data.code >= 200 && result.data.code < 300) {
    //       router.push(`/dashboard/${result.data.data.role}`);
    //     }
    //   })
    //   .catch(() => message.error("invalid username or password"));
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
            name="loginForm"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={form}
          >
            <Form.Item
              name="role"
              initialValue={"student"}
              rules={[{ required: true }]}
            >
              <Radio.Group buttonStyle="solid">
                <Radio.Button value="student">Student</Radio.Button>
                <Radio.Button value="teacher">Teacher</Radio.Button>
                <Radio.Button value="manager">Manager</Radio.Button>
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
              <Button
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                Sign in
              </Button>
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
