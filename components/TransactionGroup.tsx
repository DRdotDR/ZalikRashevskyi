import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Transaction } from "../types/Transaction";

interface TransactionGroupProps {
  date: string;
  transactions: Transaction[];
}

export const TransactionGroup: React.FC<TransactionGroupProps> = ({
  date,
  transactions,
}) => {
  return (
    <View style={styles.group}>
      <Text style={styles.date}>{date}</Text>

      {transactions.map((transaction) => (
        <View key={transaction.id} style={styles.transaction}>
          <Text>{transaction.category}</Text>
          <Text>{transaction.amount.toFixed(2)} ₴</Text>
        </View>
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
