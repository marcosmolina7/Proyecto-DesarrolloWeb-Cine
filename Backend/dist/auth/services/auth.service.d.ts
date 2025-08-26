import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(nameUser: string, passUser: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
}
