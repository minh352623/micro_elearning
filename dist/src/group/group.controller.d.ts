import { GroupService } from './group.service';
import { DataAddUserToGroup, GroupDTO } from './group.dto';
export declare class GroupController {
    private readonly groupService;
    constructor(groupService: GroupService);
    createGroup(groupDTO: GroupDTO): Promise<import("rxjs").Observable<{
        msg: string;
        data: {
            createAt: number;
            updateAt: number;
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deleted: boolean;
        };
    }>>;
    getPaginaion(limit?: number, page?: number, search?: string, order_by?: string): Promise<import("rxjs").Observable<{
        totalRow: number;
        msg: string;
        data: {
            createAt: number;
            updateAt: number;
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>>;
    updateUser(id: number, groupDTO: any): Promise<import("rxjs").Observable<{
        msg: string;
        data: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deleted: boolean;
        };
    }>>;
    deleteUserById(id: number): import("rxjs").Observable<{
        msg: string;
        data: {
            createAt: number;
            updateAt: number;
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deleted: boolean;
        };
    }>;
    addUserToGroup(dataAddUserToGroup: DataAddUserToGroup): Promise<import("rxjs").Observable<{
        msg: string;
        data: {
            count: number;
        };
    }>>;
    getGroupById(id: number): Promise<import("rxjs").Observable<{
        msg: string;
        data: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deleted: boolean;
            users: (import(".prisma/client").GroupUser & {
                user: {
                    fullname: string;
                };
            })[];
        };
    }>>;
}
