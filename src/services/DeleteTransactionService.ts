import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transaction = transactionsRepository.findOne({ where: { id } });
    if (!transaction) {
      throw new AppError('This transaction does not exist', 400);
    }
    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
