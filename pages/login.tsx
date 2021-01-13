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

//import apiServices from "../lib/services/api-service"

export const StyledButton = styled(Button)`
  &&& {
    width: 100%;
  }
`;

export interface LoginFormValues {
  email: String;
  password: String;
  role: String;
  remember: Boolean;
}

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = (values: LoginFormValues) => {
    //const onFinish = (values) => {
    console.log("Success:", values);
    if (values.role==="Student") {
      router.push('/dashboard/student')
    } else if (values.role==="Manager") {
      router.push('/dashboard/manager')
    } else if (values.role==="Teacher") {
      router.push('/dashboard/teacher')
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    alert("Failed, please check your username and password")
  };

  
  /*const login = async (loginRequest: LoginFormValues) => {
    const { data } = await apiServices.login(loginRequest);
    if(!!data) {
      //Storage.setUserInfo(data);

    }
  }*/

  /*const handleClick = (e)=>{
    e.preventDefault()
    axios.get('http://http://localhost:3000/api/login').then((res)=>{
      const data = res.data;
      console.log(res);
    }).catch((err)=>{
      console.log(err)
    })
    router.push('/dashboard/student')
  }*/

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
              <Radio.Group
                className={styles.radio}
                buttonStyle="solid"
                onChange={(event: RadioChangeEvent) => {
                  const role = event.target.value;
                  form.resetFields();
                  form.setFieldsValue({ role });
                  console.log(form);
                }}
              >
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
                  pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                  message: "Please fill in correct email",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
                onChange={(e) => {
                  const username: String = e.target.value;
                  form.resetFields();
                  form.setFieldsValue({ username });
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  pattern: /^.{4,16}$/,
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
