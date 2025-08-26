import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    getAllRoles(): Promise<{
        nameRole: string;
        descriptionRole: string | null;
        idRole: number;
    }[]>;
    getRoleById(id: string): Promise<{
        nameRole: string;
        descriptionRole: string | null;
        idRole: number;
    }>;
    createRole(data: CreateRoleDto): Promise<{
        nameRole: string;
        descriptionRole: string | null;
        idRole: number;
    }>;
    updateRole(id: string, data: UpdateRoleDto): Promise<{
        nameRole: string;
        descriptionRole: string | null;
        idRole: number;
    }>;
    deleteRole(id: string): Promise<{
        nameRole: string;
        descriptionRole: string | null;
        idRole: number;
    }>;
}
