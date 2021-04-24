import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Spin,
  InputNumber,
  DatePicker,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useSerialIds } from "highcharts";
import { useEffect, useState, useRef, useMemo } from "react";
import { gutter } from "../../lib/constant";
import {
  getCourseCode,
  getType,
  searchTeacherByName,
} from "../../lib/services/api-services";
import { CourseType, Teacher } from "../../lib/model";
import debounce from "lodash/debounce";
import { Duration } from "./duration";
import styled from "styled-components";
import TextArea from "antd/lib/input/TextArea";
import { ImageUpload } from "./upload";

const DescriptionTextArea = styled(Form.Item)`
  .ant-form-item-control {
    position: absolute;
    inset: 0;
    top: 37px;
    bottom: 30px;
  }
  .ant-form-item-control-input,
  .ant-form-item-control-input-content,
  text-area {
    height: 100%;
  }
`;

const UploadItem = styled(Form.Item)`
  .ant-upload.ant-upload-select-picture-card {
    width: 100%;
    margin: 0;
  }
  .ant-form-item-control {
    position: absolute;
    inset: 0;
    top: 37px;
    bottom: 30px;
  }
  .ant-upload-picture-card-wrapper,
  .ant-form-item-control-input,
  .ant-form-item-control-input div {
    height: 100%;
  }
  .ant-upload-picture-card-wrapper img {
    object-fit: cover !important;
  }
  .ant-upload-list-item-progress,
  .ant-tooltip {
    height: auto !important;
    .ant-tooltip-arrow {
      height: 13px;
    }
  }
  .ant-upload-list-picture-card-container {
    width: 100%;
  }
  .ant-upload-list-item-actions {
    .anticon-delete {
      color: red;
    }
  }
`;

const DebounceSelect = ({ fetchOptions, debounceTimeout = 800, ...props }) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );
  const fetchRef = useRef(0);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;

      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);
  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
};

export default function AddCourseForm() {
  const [form] = useForm();
  const { Option } = Select;
  const formRef = useRef(null);
  const [type, setType] = useState<CourseType[]>([]);
  //const [teachers, setTeacher] = useState<string[]>([]);
  const [value, setValue] = useState([]);

  const durationValidator = (_: any, value: { number: number }) => {
    if (value.number > 1) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("duration must be greater than one!"));
  };

  const setCode = () => {
    getCourseCode().then((res) => {
      formRef.current.setFieldsValue({
        code: res.data,
      });
    });
  };

  const searchTeacher = (name) => {
    return searchTeacherByName({ query: name }).then((res) => {
      const { teachers } = res.data;
      const teacherName = teachers.map((teacher) => ({
        label: teacher.name,
        value: teacher.name,
      }));
      //      setTeacher(teacherName);

      return teacherName;
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
                <DebounceSelect
                  mode="tags"
                  value={value}
                  placeholder="Select teacher"
                  fetchOptions={searchTeacher}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                />
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

      <Row gutter={gutter}>
        <Col span={8}>
          <Form.Item label="Start Date" name="datePicker">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Price" name="price" rules={[{ required: true }]}>
            <InputNumber
              min={0}
              formatter={(value) => `$ ${value}`}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Student Limit"
            name="student_limit"
            rules={[{ required: true }]}
          >
            <InputNumber
              min={0}
              max={10}
              formatter={(value) => `${value}`}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true }, { validator: durationValidator }]}
          >
            <Duration />
          </Form.Item>
        </Col>

        <Col span={8} style={{ position: "relative" }}>
          <DescriptionTextArea
            label="Description"
            name="detail"
            rules={[
              { required: true },
              {
                min: 100,
                max: 1000,
                message:
                  "Description length must between 100 - 1000 characters.",
              },
            ]}
          >
            <TextArea
              placeholder="Course description"
              style={{ height: "100%" }}
            />
          </DescriptionTextArea>
        </Col>

        <Col span={8} style={{ position: "relative" }}>
          <UploadItem label="Cover" name="cover">
            <ImageUpload />
          </UploadItem>
        </Col>
      </Row>
    </Form>
  );
}
