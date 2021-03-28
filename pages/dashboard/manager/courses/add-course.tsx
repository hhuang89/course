import { Button, Result, Steps, message } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import DetailLayout from "../../../../components/layout";

const { Step } = Steps;

const steps = [
  {
    title: "Course Detail",
    content: "First-content",
  },
  {
    title: "Course Schedule",
    content: "Second-content",
  },
  {
    title: "Success",
    content: "Last-content",
  },
];

export default function AddCourse() {
  const [current, setCurrent] = React.useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <DetailLayout>
      <Steps type="navigation" current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </DetailLayout>
  );
}
