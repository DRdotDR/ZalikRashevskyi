import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  FlatList,
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
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShowDatePicker(false);
  };

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
      <Text style={styles.title}>Облік витрат</Text>

      <Text style={styles.total}>
        Всього: {total.toFixed(2)} ₴
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Сума"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        style={styles.input}
        placeholder="Категорія"
        value={category}
        onChangeText={setCategory}
      />

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
        style={styles.button}
        onPress={addTransaction}
      >
        <Text style={styles.buttonText}>
          Додати транзакцію
        </Text>
      </TouchableOpacity>

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
});