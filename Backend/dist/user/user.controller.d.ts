import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<{
        idRole: number;
        nameUser: string;
        passUser: string;
        idUser: number;
    }[]>;
    getUserById(id: string): Promise<{
        idRole: number;
        nameUser: string;
        passUser: string;
        idUser: number;
    }>;
    createUser(data: CreateUserDto): Promise<{
        idRole: number;
        nameUser: string;
        passUser: string;
        idUser: number;
    }>;
    updateUser(id: string, data: UpdateUserDto): Promise<{
        idRole: number;
        nameUser: string;
        passUser: string;
        idUser: number;
    }>;
    deleteUser(id: string): Promise<{
        idRole: number;
        nameUser: string;
        passUser: string;
        idUser: number;
    }>;
}
