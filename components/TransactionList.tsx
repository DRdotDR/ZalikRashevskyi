import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Transaction } from "../types/Transaction";
import { TransactionGroup } from "./TransactionGroup";

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDeleteTransaction,
}) => {
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

  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Нічого немає. Натисни + щоб додати нову транзакцію.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={Object.keys(grouped)}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TransactionGroup
          date={item}
          transactions={grouped[item]}
          onDeleteTransaction={onDeleteTransaction}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});
