let balance = 500.00;

class Withdrawal {

  constructor(amount) {
    this.amount = amount;
  }

  commit() {
    balance -= this.amount;
  }

}




// DRIVER CODE BELOW
// We use the code below to "drive" the application logic above and make sure it's working as expected

t1 = new Withdrawal(50.25);
t1.commit();
console.log('Transaction 1:', t1);

t2 = new Withdrawal(9.99);
t2.commit();
console.log('Transaction 2:', t2);

console.log('Balance:', balance);
class Account {
  constructor(username) {
    this.username = username;
    this.transactions = [];
  }

  get balance() {
    // Calculate the balance using the transaction objects
    return this.transactions.reduce(
      (total, transaction) => total + transaction.value,
      0
    );
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
    this.amount = amount;
    this.account = account;
  }

  commit() {
    if (!this.isAllowed()) return false; // If transaction is not allowed immediately exit the function
    this.time = new Date(); // Keep track of the time of the transaction
    this.account.addTransaction(this); // Add the transaction to the account
    return true;
  }
}

// Pass in the account that the deposit this for
class Deposit extends Transaction {
  get value() {
    return this.amount; // Positive amount for deposits
  }
  isAllowed() {
    // Deposits are always allowed
    return true;
  }
}

// Pass in the account that the withdrawal this for
class Withdrawal extends Transaction {
  get value() {
    return -this.amount; // Negative amount for withdrawals
  }
  isAllowed() {
    // Check if the account balance is sufficient for the withdrawal
    if (this.account.balance < this.amount) {
      throw new Error("Insufficient funds for this withdrawal.");
    }
    return true;
  }
}

// DRIVER CODE BELOW
// We use the code below to "drive" the application logic above and make sure it's working as expected

const myAccount = new Account("billybob");

console.log("Starting Balance:", myAccount.balance);

// Test deposit
const t1 = new Deposit(120.0, myAccount);
console.log("Deposit Success:", t1.commit());
console.log("Balance after Deposit:", myAccount.balance);

// Test withdrawal within balance
const t2 = new Withdrawal(50.0, myAccount);
console.log("Withdrawal Success:", t2.commit());
console.log("Balance after Withdrawal:", myAccount.balance);

// Test withdrawal exceeding balance
const t3 = new Withdrawal(100.0, myAccount);
console.log("Withdrawal Success:", t3.commit()); // Should fail
console.log("Balance after Failed Withdrawal:", myAccount.balance);

// Test another withdrawal within balance
const t4 = new Withdrawal(30.0, myAccount);
console.log("Withdrawal Success:", t4.commit());
console.log("Balance after Withdrawal:", myAccount.balance);
