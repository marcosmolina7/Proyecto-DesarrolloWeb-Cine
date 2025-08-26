import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordService } from 'src/auth/services/password.service';
export declare class UserService {
    private prisma;
    private passwordService;
    constructor(prisma: PrismaService, passwordService: PasswordService);
    getAllUsers(): Promise<User[]>;
    getUserById(idUser: number): Promise<User>;
    createUser(data: CreateUserDto): Promise<User>;
    updateUser(idUser: number, data: UpdateUserDto): Promise<User>;
    deleteUser(idUser: number): Promise<User>;
    getUserByName(nameUser: string): Promise<User | null>;
}
