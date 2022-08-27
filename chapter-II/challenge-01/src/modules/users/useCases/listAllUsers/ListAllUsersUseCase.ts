import { User } from "../../model/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  user_id: string | string[];
}

class ListAllUsersUseCase {
  constructor(private usersRepository: IUsersRepository) { }

  execute({ user_id }: IRequest): User[] {

    if (typeof user_id !== "string") {
      throw new Error("Invalid value for user_id on header");
    }

    const user = this.usersRepository.findById(user_id);

    if (!user || !user || !user?.admin) {
      throw new Error("User not found or not admin");
    }

    return this.usersRepository.list();
  }
}

export { ListAllUsersUseCase };
