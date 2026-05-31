import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionList } from "../components/TransactionList";
import { Transaction } from "../types/Transaction";

export default function HomeScreen() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

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

    const existingCategories = [...new Set(transactions.map((t) => t.category))];
    const filtered = existingCategories.filter((cat) =>
      cat.toLowerCase().includes(text.toLowerCase())
    );

    setSuggestedCategories(filtered);
  };

  const selectCategory = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setSuggestedCategories([]);
  };

  const isAmountValid =
    amount === "" ? false : !isNaN(Number(amount)) && Number(amount) > 0;
  const isFormComplete = Boolean(amount && category && isAmountValid);

  const total = transactions.reduce((sum, item) => sum + item.amount, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Витрати</Text>

      <Text style={styles.total}>Всього: {total.toFixed(2)} ₴</Text>

      <TransactionList transactions={transactions} />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      <TransactionForm
        visible={showModal}
        onClose={() => setShowModal(false)}
        amount={amount}
        onAmountChange={setAmount}
        category={category}
        onCategoryChange={handleCategoryChange}
        suggestedCategories={suggestedCategories}
        onCategorySelect={selectCategory}
        date={date}
        showDatePicker={showDatePicker}
        onDateChange={handleDateChange}
        onDatePress={() => setShowDatePicker(true)}
        isAmountValid={isAmountValid}
        isFormComplete={isFormComplete}
        onSubmit={addTransaction}
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
});