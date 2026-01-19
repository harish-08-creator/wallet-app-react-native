import { sql } from "../config/db.js";

export async function getTransactionByUserId(req, res) {
  try {
    const { userId } = req.params;
    const transactions = await sql`
                SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_dt DESC
            `;
    res.status(201).json(transactions);
  } catch (error) {
    console.log("Error getting the transaction: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createTransaction(req, res) {
  //title, amount, category, user_id
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !category || !user_id || amount === undefined)
      return res.status(400).json({ message: "All fields are mandatory" });
    const transaction = await sql`
            INSERT INTO transactions(user_id,title,amount,category)
            VALUES(${user_id},${title},${amount},${category})
            RETURNING *
          `;

    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating transaction: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id)))
      return res.status(400).json({ message: "Id should be a number" });

    const result = await sql`
            DELETE FROM transactions WHERE id=${id}
            RETURNING *
            `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.log("Error deleting transaction: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
            SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id=${userId} 
        `;

    const incomeResult = await sql`
            SELECT COALESCE(SUM(amount),0) as income FROM transactions
            WHERE user_id=${userId} AND amount>0
      `;

    const expensesResult = await sql`
            SELECT COALESCE(SUM(amount),0) as expenses FROM transactions
            WHERE user_id=${userId} AND amount<0
      `;

    res.status(201).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.log("Error getting transaction summary: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
