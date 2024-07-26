import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

type CryptoInputPropsType = {
  label: string;
  placeholder: string;
  precision?: number;
  step?: number;
  value?: number;
  onValueChange?: (valueAsString: string, valueAsNumber: number) => void;
  max?: number;
};

const CryptoInput = (props: CryptoInputPropsType) => {
  const { label, placeholder, precision, step, value, onValueChange, max } =
    props; // destructure the props
  // Ensure the value is a valid number
  const safeValue = isNaN(value!) ? 0 : value;
  return (
    <FormControl w={"80%"} my={"10px"} mx={"auto"}>
      <FormLabel>{label}</FormLabel>
      <NumberInput
        defaultValue={0}
        step={step || 0.01}
        min={0}
        precision={precision || 5}
        value={safeValue}
        onChange={onValueChange}
        max={max}
      >
        <NumberInputField placeholder={placeholder} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </FormControl>
  );
};

export default CryptoInput;
