export const formatDate = (d) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(d));
export const expenseCategories = [
  "Food",
  "Shopping",
  "Transport",
  "Rent",
  "Bills",
  "Entertainment",
  "Healthcare",
  "Education",
  "Subscriptions",
  "Travel",
  "Groceries",
  "Personal Care",
  "Other",
];
export const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Other Income",
];
export const methods = [
  "Cash",
  "UPI",
  "Debit Card",
  "Credit Card",
  "Bank Transfer",
  "Wallet",
  "Other",
];
