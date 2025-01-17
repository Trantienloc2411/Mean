export const TransactionStatusEnum = {
  ACTIVE: { label: "Hoạt động", color: "green" },
  PENDING: { label: "Chờ xác nhận", color: "orange" },
  INACTIVE: { label: "Hủy", color: "volcano" },
};

export const TransactionTypeEnum = {
  DEPOSIT: { label: "Tiền cọc", color: "blue" },
  FULL_PAYMENT: { label: "Trả full", color: "green" },
  REFUND: { label: "Hoàn tiền", color: "red" },
  FINAL_PAYMENT: { label: "Thanh toán cuối", color: "orange" },
};
