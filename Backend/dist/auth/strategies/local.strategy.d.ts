import { UserService } from 'src/user/user.service';
import { PasswordService } from '../services/password.service';
declare const LocalStrategy_base: new (...args: any) => any;
export declare class LocalStrategy extends LocalStrategy_base {
    private passwordService;
    private userService;
    constructor(passwordService: PasswordService, userService: UserService);
    validate(nameUser: string, passUser: string): Promise<any>;
}
export {};
