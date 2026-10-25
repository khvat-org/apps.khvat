import React, { useState } from "react";

import { EyeIcon, EyeSlashIcon } from "phosphor-react-native";
import { TextInput, View, StyleSheet, Pressable, Text } from "react-native";

import { isExpoGo } from "../../constants/environment";
import { ColorsType, useThemeContext } from "../../contexts/theme/theme-context";
import { Typography } from "../../typography";

type DatePickerComponent = typeof import("react-native-date-picker").default;

const loadDatePicker = (): DatePickerComponent | null => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return (require("react-native-date-picker") as { default: DatePickerComponent }).default;
  } catch {
    return null;
  }
};

const MIN_YEAR = 1900;

const CODE_LENGTH = 6;

const maskDateInput = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 8);

  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)];

  return parts.filter((part) => part.length > 0).join(".");
};

const parseMaskedDate = (masked: string): Date | null => {
  const digits = masked.replace(/\D/g, "");
  if (digits.length !== 8) return null;

  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));

  if (year < MIN_YEAR || month < 1 || month > 12 || day < 1) return null;

  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  if (date.getTime() > Date.now()) return null;

  return date;
};

const formatDate = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
};

interface InputProps {
  placeholder: string;
  onChange?: (val: string) => void;

  value?: string;
  autoFocus?: boolean;

  error?: string;

  isSecure?: boolean;
  isAge?: boolean;
  isCode?: boolean;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  onChange,
  value,
  autoFocus,
  isSecure,
  isAge,
  isCode,
  error,
}) => {
  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const [secureText, setSecureText] = useState(isSecure);

  const [date, setDate] = useState<Date | null>(null);
  const [isOpenAge, setIsOpenAge] = useState(false);
  const [maskedDate, setMaskedDate] = useState("");

  if (isAge && isExpoGo) {
    const onChangeMasked = (raw: string) => {
      const masked = maskDateInput(raw);
      setMaskedDate(masked);

      const parsed = parseMaskedDate(masked);
      onChange?.(parsed ? parsed.toString() : "");
    };

    return (
      <>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder={`${placeholder} · DD.MM.YYYY`}
            placeholderTextColor={colors.TextSecondary}
            onChangeText={onChangeMasked}
            value={maskedDate}
            autoFocus={autoFocus}
            keyboardType="number-pad"
            maxLength={10}
          />
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </>
    );
  }

  if (isAge) {
    const DatePicker = loadDatePicker();

    return (
      <>
        <View style={styles.container}>
          <Pressable style={styles.input} onPress={() => setIsOpenAge(true)}>
            <Text style={[styles.text, date !== null && styles.textActive]}>
              {date === null && placeholder}
              {date !== null && formatDate(date)}
            </Text>
          </Pressable>
        </View>
        {DatePicker && (
          <DatePicker
            modal
            open={isOpenAge}
            date={date ?? new Date()}
            mode="date"
            maximumDate={new Date()}
            minimumDate={new Date(MIN_YEAR, 0, 1)}
            onConfirm={(date) => {
              setDate(date);
              onChange?.(date.toString());
              setIsOpenAge(false);
            }}
            onCancel={() => setIsOpenAge(false)}
          />
        )}
        {error && <Text style={styles.error}>{error}</Text>}
      </>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.TextSecondary}
          onChangeText={onChange}
          value={value}
          autoFocus={autoFocus}
          secureTextEntry={secureText}
          {...(isCode && {
            keyboardType: "number-pad",
            textContentType: "oneTimeCode",
            autoComplete: "one-time-code",
            maxLength: CODE_LENGTH,
          })}
        />

        {isSecure && (
          <Pressable style={styles.icon} onPress={() => setSecureText((val) => !val)}>
            {!secureText && <EyeIcon size={20} color={colors.BgContrast} />}
            {secureText && <EyeSlashIcon size={20} color={colors.BgContrast} />}
          </Pressable>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      width: "100%",

      backgroundColor: colors.BgSecondary,
      borderRadius: 12,

      position: "relative",
    },
    input: {
      color: colors.TextPrimary,

      ...Typography.boldDefault,

      paddingHorizontal: 16,

      height: 48,
    },
    text: {
      color: colors.TextSecondary,

      ...Typography.boldDefault,

      paddingVertical: 10,

      height: 48,
    },
    textActive: {
      color: colors.TextPrimary,
    },
    icon: {
      position: "absolute",
      right: 16,
      top: 14,
    },

    error: {
      ...Typography.regularLabel,

      color: colors.TextDanger,
    },
  });

export default Input;
