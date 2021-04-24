import React, { useState } from "react";
import { Form, Input, Select, Button, InputNumber } from "antd";
import { units } from "../../lib/constant";

const { Option } = Select;

type Unit = "year" | "month" | "day" | "week" | "hour";

interface DurationValue {
  number: number;
  unit: string;
}

interface DurationInputProps {
  value?: DurationValue;
  onChange?: (value: DurationValue) => void;
}

export const Duration: React.FC<DurationInputProps> = ({ value = {}, onChange }) => {
  const [number, setNumber] = useState(null);
  const [unit, setUnit] = useState<Unit>("month");

  const triggerChange = (changedValue: { number?: number; unit?: Unit }) => {
    onChange?.({ number, unit, ...value, ...changedValue });
  };

  const onNumberChange = (changedValue: number) => {
    const newNumber = changedValue;
    if (Number.isNaN(number)) {
      return;
    }
    if (!("number" in value)) {
      setNumber(newNumber);
    }
    triggerChange({ number: newNumber });
  };

  const onUnitChange = (newUnit: Unit) => {
    if (!("unit" in value)) {
      setUnit(newUnit);
    }
    triggerChange({ unit: newUnit });
  };

  return (
    <Input.Group compact style={{ display: 'flex' }}>
      <InputNumber
        value={value.number || number}
        style={{ flex: 1 }}
        onChange={onNumberChange}
      />
      <Select
        value={value.unit || unit}
        onChange={onUnitChange}
      >
        {units.map((unit) => (
          <Option key={unit} value={unit}>
            {unit}
          </Option>
        ))}
      </Select>
    </Input.Group>
  );
};
