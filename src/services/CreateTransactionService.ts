import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepositoryCheck = getCustomRepository(
      TransactionsRepository,
    );
    const balanceCheck = await transactionsRepositoryCheck.getBalance();
    const hasFunds = type === 'outcome' && balanceCheck.total - value <= 0;

    if (hasFunds) {
      throw new AppError("You don't have enough funds", 400);
    }

    let categoryId = '';
    const categoryRepository = getRepository(Category);
    const checkCategoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (checkCategoryExists) {
      categoryId = checkCategoryExists.id;
    } else {
      const createdCategory = categoryRepository.create({ title: category });
      const savedCategory = await categoryRepository.save(createdCategory);
      categoryId = savedCategory.id;
    }

    const transactionsRepository = getRepository(Transaction);
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryId,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
