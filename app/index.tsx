import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Transaction = {
  id: string;
  amount: number;
  category: string;
  date: string;
};

export default function HomeScreen() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const addTransaction = () => {
    if (!amount || !category) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      amount: Number(amount),
      category,
      date: date.toLocaleDateString(),
    };

    setTransactions([transaction, ...transactions]);
    setAmount("");
    setCategory("");
    setDate(new Date());
    setShowModal(false);
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleCategoryChange = (text: string) => {
    setCategory(text);
    
    if (text.trim() === "") {
      setSuggestedCategories([]);
      return;
    }
    
    const existingCategories = [...new Set(transactions.map(t => t.category))];
    const filtered = existingCategories.filter(cat =>
      cat.toLowerCase().includes(text.toLowerCase())
    );
    
    setSuggestedCategories(filtered);
  };

  const selectCategory = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setSuggestedCategories([]);
  };

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
  }, [suggestedCategories]);

  const isAmountValid = amount === "" ? false : !isNaN(Number(amount)) && Number(amount) > 0;
  const isFormComplete = amount && category && isAmountValid;

  const total = transactions.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const grouped = transactions.reduce(
    (acc: Record<string, Transaction[]>, transaction) => {
      if (!acc[transaction.date]) {
        acc[transaction.date] = [];
      }

      acc[transaction.date].push(transaction);
      return acc;
    },
    {}
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Витрати</Text>

      <Text style={styles.total}>
        Всього: {total.toFixed(2)} ₴
      </Text>

      <FlatList
        data={Object.keys(grouped)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.group}>
            <Text style={styles.date}>{item}</Text>

            {grouped[item].map((transaction) => (
              <View
                key={transaction.id}
                style={styles.transaction}
              >
                <Text>{transaction.category}</Text>
                <Text>
                  {transaction.amount.toFixed(2)} ₴
                </Text>
              </View>
            ))}
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <TextInput
              style={[styles.input, !isAmountValid && amount !== "" && styles.inputError]}
              placeholder="Сума"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            {!isAmountValid && amount !== "" && (
              <Text style={styles.helpText}>Сума може мати лише цифри та десяткову крапку</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Категорія"
              value={category}
              onChangeText={handleCategoryChange}
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
                    onPress={() => selectCategory(cat)}
                  >
                    <Text style={styles.suggestionText}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                Дата: {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <TouchableOpacity
              style={[styles.button, !isFormComplete && styles.buttonDisabled]}
              onPress={addTransaction}
              disabled={!isFormComplete}
            >
              <Text style={[styles.buttonText, !isFormComplete && styles.buttonDisabledText]}>
                Додати транзакцію
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  total: {
    fontSize: 20,
    marginBottom: 20,
  },
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
  group: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  date: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  floatingButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingButtonText: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
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