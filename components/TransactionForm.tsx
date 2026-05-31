import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const locale = new Intl.DateTimeFormat("uk-UA");

interface TransactionFormProps {
  visible: boolean;
  onClose: () => void;
  amount: string;
  onAmountChange: (text: string) => void;
  category: string;
  onCategoryChange: (text: string) => void;
  suggestedCategories: string[];
  onCategorySelect: (category: string) => void;
  date: Date;
  showDatePicker: boolean;
  onDateChange: (event: any, selectedDate: Date | undefined) => void;
  onDatePress: () => void;
  isAmountValid: boolean;
  isFormComplete: boolean;
  onSubmit: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  visible,
  onClose,
  amount,
  onAmountChange,
  category,
  onCategoryChange,
  suggestedCategories,
  onCategorySelect,
  date,
  showDatePicker,
  onDateChange,
  onDatePress,
  isAmountValid,
  isFormComplete,
  onSubmit,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const helpTextAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (suggestedCategories.length > 0) {
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [suggestedCategories, animatedValue]);

  useEffect(() => {
    const shouldShowHelpText = !isAmountValid && amount !== "";
    if (shouldShowHelpText) {
      Animated.spring(helpTextAnimatedValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(helpTextAnimatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isAmountValid, amount, helpTextAnimatedValue]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <TextInput
            style={[
              styles.input,
              !isAmountValid && amount !== "" && styles.inputError,
            ]}
            placeholder="Сума"
            keyboardType="numeric"
            value={amount}
            onChangeText={onAmountChange}
          />

          {!isAmountValid && amount !== "" && (
            <Animated.View
              style={{
                opacity: helpTextAnimatedValue,
                transform: [
                  {
                    scale: helpTextAnimatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              }}
            >
              <Text style={styles.helpText}>
                Сума може мати лише цифри та десяткову крапку
              </Text>
            </Animated.View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Категорія"
            value={category}
            onChangeText={onCategoryChange}
          />

          {suggestedCategories.length > 0 && (
            <Animated.View
              style={[
                styles.suggestionsContainer,
                {
                  opacity: animatedValue,
                  transform: [
                    {
                      scale: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              {suggestedCategories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={styles.suggestionItem}
                  onPress={() => onCategorySelect(cat)}
                >
                  <Text style={styles.suggestionText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}

          <TouchableOpacity style={styles.dateButton} onPress={onDatePress}>
            <Text style={styles.dateButtonText}>
              Дата: {locale.format(date)}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              locale="uk-UA"
              onChange={onDateChange}
            />
          )}

          <TouchableOpacity
            style={[styles.button, !isFormComplete && styles.buttonDisabled]}
            onPress={onSubmit}
            disabled={!isFormComplete}
          >
            <Text
              style={[
                styles.buttonText,
                !isFormComplete && styles.buttonDisabledText,
              ]}
            >
              Додати транзакцію
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  inputError: {
    borderColor: "#ff0000",
    backgroundColor: "#ffe6e6",
  },
  helpText: {
    color: "#ff0000",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonDisabledText: {
    color: "#666666",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  suggestionsContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: -8,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    fontSize: 14,
    color: "#007AFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  closeButtonText: {
    fontSize: 28,
    color: "#999",
  },
});
