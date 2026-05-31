import React from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";
import { Transaction } from "../types/Transaction";

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onDelete,
}) => {
  const handleLongPress = () => {
    Alert.alert(
      "Видалити транзакцію?",
      `${transaction.category} - ${transaction.amount.toFixed(2)} ₴`,
      [
        {
          text: "Скасувати",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Видалити",
          onPress: () => onDelete(transaction.id),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.transaction}
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      <Text style={styles.category}>{transaction.category}</Text>
      <Text style={styles.amount}>{transaction.amount.toFixed(2)} ₴</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 5,
    marginVertical: 2,
    borderRadius: 4,
  },
  category: {
    fontSize: 14,
    color: "#333",
  },
  amount: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
});
