import React from "react";
import { FlatList } from "react-native";
import { Transaction } from "../types/Transaction";
import { TransactionGroup } from "./TransactionGroup";

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
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

  return (
    <FlatList
      data={Object.keys(grouped)}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TransactionGroup date={item} transactions={grouped[item]} />
      )}
    />
  );
};
