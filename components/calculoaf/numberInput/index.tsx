import { StyleSheet, TextInput, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Numberish, isValid } from "../types/numberish";
import { ThemedText } from '@/components/ThemedText';

export interface NumberInputProps
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "value"
  > {
  value: Numberish;
  setValue: (value: Numberish) => void;
  label: string | JSX.Element;
  id: string;
  disabled?: boolean;
  required?: boolean;
  precision?: number;
  min?: number;
  max?: number;
  enforceBounds?: boolean;
  allowNegative?: boolean;
}

export const NumberInput = (props: NumberInputProps) => {
  const {
    id,
    value,
    setValue,
    label,
    precision,
    required,
    enforceBounds,
    min,
    max,
    allowNegative,
  } = props;

  const [displayValue, setDisplayValue] = useState<string>("");
  const [internalValue, setInternalValue] = useState<Numberish>(null);
  const [error, setError] = useState<boolean>(false);

  const pattern = useMemo(() => {
    return RegExp(`^${allowNegative ? "-?" : ""}[0-9]*[\.,]?[0-9]*$`);
  }, [allowNegative]);

  const isValidFormat = useCallback(
    (s: string) => {
      return pattern.test(s);
    },
    [pattern]
  );

  const updateInternalValue = useCallback(
    (n: Numberish) => {
      if (!isValid(n)) {
        setInternalValue(n);
        return;
      }
      if (max != null && n > max) {
        if (enforceBounds) {
          setInternalValue(max);
        } else {
          setError(true);
        }
        return;
      }

      if (min != null && n < min) {
        if (enforceBounds) {
          setInternalValue(min);
        } else {
          setError(true);
        }
        return;
      }

      setInternalValue(n);
    },
    [enforceBounds, min, max]
  );

  // handle valid input strings
  const onDisplayChange = useCallback(
    (input: string) => {
      setDisplayValue(input);
      if (input === "") {
        setInternalValue(null);
      } else {
        const n: number = parseFloat(input);
        if (n !== internalValue) {
          updateInternalValue(n);
        }
      }
    },
    [internalValue]
  );

  // handle raw changes to the component
  const onInputChange = useCallback(
    (val: string) => {
      if (isValidFormat(val)) {
        onDisplayChange(val);
      }
    },
    [isValidFormat, displayValue]
  );

  // update prop.value on blur; should trigger format indirectly via effect
  const onBlur = useCallback(() => {
    setValue(internalValue);
  }, [setValue, internalValue]);

  // formatting callback; if 'live' updating, can't do ToFixed
  const getDisplayValue = useCallback(
    (n: Numberish) => {
      if (n === null) {
        return "";
      } else if (isNaN(n)) {
        return displayValue;
      } else {
        return n.toFixed(precision);
      }
    },
    [displayValue]
  );

  const handleError = useCallback(
    (value: Numberish) => {
      if (value === null) {
        setError(!!required);
      } else if (isNaN(value)) {
        setError(true);
      } else {
        setError(false);
      }
    },
    [required]
  );

  // format and adjust ground truth whenever we receieve an updated prop value
  useEffect(() => {
    setDisplayValue(getDisplayValue(value));
    updateInternalValue(value);

    handleError(value);
  }, [value]);

  return (
    <View style={styles.container}>
      <ThemedText>{label}</ThemedText>
      <TextInput
        style={styles.input}
        inputMode="numeric"
        onChangeText={onInputChange}
        onBlur={onBlur}
        value={displayValue}
        aria-describedby={`${id}-error`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    color: 'white'
  },
  input: {
    borderColor: "white",
    borderRadius: 2,
    borderWidth: 1,
    padding: 6,
    margin: 3,
    color: "white",
    minWidth: 150
  },
});
