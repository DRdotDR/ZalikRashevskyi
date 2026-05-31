import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Transaction } from "../types/Transaction";
import { TransactionItem } from "./TransactionItem";

interface TransactionGroupProps {
  date: string;
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export const TransactionGroup: React.FC<TransactionGroupProps> = ({
  date,
  transactions,
  onDeleteTransaction,
}) => {
  return (
    <View style={styles.group}>
      <Text style={styles.date}>{date}</Text>

      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onDelete={onDeleteTransaction}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  group: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#a5b7d8",
  },
  date: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});
