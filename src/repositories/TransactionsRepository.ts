import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const findTransactions = await this.find();
    const income = findTransactions
      .filter(({ type }) => type === 'income')
      .reduce((sum, record) => sum + Number(record.value), 0) as number;
    const outcome = findTransactions
      .filter(({ type }) => type === 'outcome')
      .reduce((sum, record) => sum + Number(record.value), 0) as number;
    const total = income - outcome;

    const balance = { income, outcome, total };

    return balance || null;
  }
}

export default TransactionsRepository;
