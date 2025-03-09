/*
 *   Copyright (c) 2025 Laith Alkhaddam aka Iconical or Sleepyico.
 *   All rights reserved.

 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at

 *   http://www.apache.org/licenses/LICENSE-2.0

 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

import { Transaction } from "@/types/Transaction";
import { NextResponse } from "next/server";
import { QuickDB } from "quick.db";

const db = new QuickDB();

export async function GET() {
  const transactions = await db.get("transactions");

  const currentBalance = (await db.get("balance")) || 0;

  return new NextResponse(
    JSON.stringify({
      transactions,
      currentBalance,
    }),
    { status: 200 }
  );
}
export async function POST(request: Request) {
  const { type, amount, description }: Transaction = await request.json();

  let currentBalance = (await db.get("balance")) || 0;

  if (type === "income") {
    currentBalance += amount;
  } else if (type === "expense") {
    currentBalance -= amount;
  }

  let transactionId = (await db.get("transactionId")) || 0;
  transactionId++;

  const transaction: Transaction = {
    tid: transactionId,
    type,
    amount,
    description: description || "No description provided",
    date: new Date().toISOString(),
  };

  const transactions = (await db.get("transactions")) || [];

  transactions.push(transaction);

  await db.set("transactions", transactions);
  await db.set("transactionId", transactionId);

  await db.set("balance", currentBalance);

  return new NextResponse(
    JSON.stringify({
      message: "Transaction added",
      transaction,
      currentBalance,
    }),
    { status: 201 }
  );
}

export async function DELETE(request: Request) {
  const { tid }: { tid: number } = await request.json();

  const transactions = (await db.get("transactions")) || [];

  const transactionToDelete = transactions.find(
    (transaction: Transaction) => transaction.tid === tid
  );

  if (!transactionToDelete) {
    return new NextResponse(
      JSON.stringify({ message: "Transaction not found" }),
      { status: 404 }
    );
  }

  const updatedTransactions = transactions.filter(
    (transaction: Transaction) => transaction.tid !== tid
  );

  let currentBalance = (await db.get("balance")) || 0;

  if (transactionToDelete.type === "income") {
    currentBalance -= transactionToDelete.amount;
  } else if (transactionToDelete.type === "expense") {
    currentBalance += transactionToDelete.amount;
  }

  await db.set("transactions", updatedTransactions);
  await db.set("balance", currentBalance);

  return new NextResponse(
    JSON.stringify({
      message: "Transaction deleted successfully",
      currentBalance,
    }),
    { status: 200 }
  );
}
