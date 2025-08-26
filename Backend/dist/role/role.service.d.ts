import { Role } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RoleService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllRoles(): Promise<Role[]>;
    getRoleById(idRole: number): Promise<Role>;
    createRole(data: CreateRoleDto): Promise<Role>;
    updateRole(idRole: number, data: UpdateRoleDto): Promise<Role>;
    deleteRole(idRole: number): Promise<Role>;
}
