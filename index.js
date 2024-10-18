class Account {
  constructor(username) {
    this.username = username;
    this.transactions = [];
  }

  get balance() {
    // Calculate the balance using the transaction objects
    const total = this.transactions.reduce(
      (total, transaction) => total + transaction.value,
      0
    );
    // Round the balance to 2 decimal places and return
    return Math.round(total * 100) / 100;
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
  }
}

// Transaction superclass for Deposit and Withdrawal classes
class Transaction {
  constructor(amount, account) {
    if (!account)
      throw new Error("Transaction must be associated with a valid account.");
    if (amount <= 0)
      throw new Error("Transaction amount must be greater than zero.");
    this.amount = Math.round(amount * 100); // Store amounts as integers representing cents
    this.account = account;
    this.hasCommitted = false;
  }

  commit() {
    // Prevent committing multiple times
    if (this.hasCommitted) {
      return {
        success: false,
        message: "Transaction already committed.",
      };
    }
    // If transaction is not allowed immediately exit the function
    if (!this.isAllowed()) {
      return {
        success: false,
        message: "Insufficient funds for this withdrawal.",
      };
    }
    this.time = new Date();            // Keep track of the time of the transaction
    this.account.addTransaction(this); // Add the transaction to the account
    this.hasCommitted = true;          // Mark the transaction as committed
    return { success: true, message: "Transaction successful." };
  }
}

// Pass in the account that the deposit this for
class Deposit extends Transaction {
  get value() {
    return this.amount / 100; // Positive amount for deposits and return in dollars when needed
  }
  isAllowed() {
    // Deposits are always allowed
    return true;
  }
}

// Pass in the account that the withdrawal this for
class Withdrawal extends Transaction {
  get value() {
    return -this.amount / 100; // Negative amount for withdrawals and return in dollars when needed
  }
  isAllowed() {
    // Check if the account balance is sufficient for the withdrawal
    return this.account.balance >= this.amount / 100; // Return a boolean instead of throwing an error
  }
}

// DRIVER CODE BELOW
const myAccount = new Account("billybob");

console.log("Starting Balance:", myAccount.balance);

// Test deposit
const t1 = new Deposit(120.90, myAccount);
const t1Result = t1.commit();
console.log("Deposit Success:", t1Result.message);
console.log("Balance after Deposit:", myAccount.balance);

// Test withdrawal within balance
const t2 = new Withdrawal(50.41, myAccount);
const t2Result = t2.commit();
console.log("Withdrawal Success:", t2Result.message);
console.log("Balance after Withdrawal:", myAccount.balance);

// Test withdrawal exceeding balance
const t3 = new Withdrawal(100.37, myAccount);
const t3Result = t3.commit(); // Should fail
console.log("Withdrawal Success:", t3Result.message);
console.log("Balance after Failed Withdrawal:", myAccount.balance);

// Test another withdrawal within balance
const t4 = new Withdrawal(30.52, myAccount);
const t4Result = t4.commit();
console.log("Withdrawal Success:", t4Result.message);
console.log("Balance after Withdrawal:", myAccount.balance);
