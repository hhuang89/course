import { Form, Row, Col, Input, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useSerialIds } from "highcharts";
import { useEffect, useState, useRef } from "react";
import { gutter } from "../../lib/constant";
import { getCourseCode, getType } from "../../lib/services/api-services";
import { CourseType, courseType } from "../../lib/model/course";

export default function AddCourseForm() {
  const [form] = useForm();
  const { Option } = Select;
  const formRef = useRef(null);
  const [type, setType] = useState<CourseType[]>([]);

  const setCode = () => {
    getCourseCode().then((res) => {
      formRef.current.setFieldsValue({
        code: res.data,
      });
    });
  };
  useEffect(() => {
    setCode();

    getType().then((res) => {
      setType(res.data);
    });
  }, []);

  return (
    <Form
      labelCol={{ offset: 1 }}
      wrapperCol={{ offset: 1 }}
      layout="vertical"
      ref={formRef}
    >
      <Row gutter={gutter}>
        <Col span={8}>
          <Form.Item
            label="Course Name"
            name="name"
            rules={[{ required: true }, { max: 100, min: 3 }]}
          >
            <Input type="text" placeholder="course name" />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Row gutter={gutter}>
            <Col span={8}>
              <Form.Item
                label="Teacher"
                name="teacher"
                rules={[{ required: true }]}
              >
                <Select defaultValue="Select teacher"></Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Type" name="type" rules={[{ required: true }]}>
                <Select mode="multiple">
                  {type?.map((type) => (
                    <Option key={type.id} value={type.id}>
                      {type.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Course code"
                name="code"
                rules={[{ required: true }]}
              >
                <Input disabled={true}></Input>
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
}
