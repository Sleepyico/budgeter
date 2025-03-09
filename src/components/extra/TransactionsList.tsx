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
"use client";

import React, { useEffect, useState } from "react";
import HoverEffect from "../effects/HoverEffect";
import { useBalance } from "@/contexts/BalanceContext";
import { Transaction } from "@/types/Transaction";
import SingleTransaction from "./Transaction";
import { Icon } from "@iconify/react";
import { printTransactions } from "@/lib/download";

export default function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { currentBalance } = useBalance();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        const data = await response.json();

        // Extracting transactions from the response and setting them as state
        if (data.transactions) {
          setTransactions(data.transactions); // Set transactions state
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [currentBalance]);

  return (
    <HoverEffect bgColor="#3D3D3D">
      <div className="flex justify-between">
        <h2 className="font-semibold text-xl mb-4 border-b-2 border-primary/24">
          Transactions
        </h2>
        <Icon
          icon="line-md:cloud-alt-print-twotone-loop"
          onClick={() => printTransactions(transactions)}
          width={28}
          aria-valuetext="Print"
        >
          Print
        </Icon>
      </div>
      <div className="flex flex-col gap-2">
        {transactions.length > 0 ? (
          transactions.map((trx: Transaction) => {
            return <SingleTransaction key={trx.tid} trx={trx} />;
          })
        ) : (
          <span className="text-center py-7">No transactions found</span>
        )}
      </div>
    </HoverEffect>
  );
}
