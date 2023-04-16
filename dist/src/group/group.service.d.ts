import { DatabaseService } from 'src/database/database.service';
import { SearchService } from 'src/search/search.service';
import { DataAddUserToGroup, GroupDTO } from './group.dto';
import { Prisma } from '@prisma/client';
export declare class GroupService {
    private databaseService;
    private readonly searchService;
    private loggerService;
    constructor(databaseService: DatabaseService, searchService: SearchService);
    CreateGroup(group: GroupDTO): Promise<import("rxjs").Observable<{
        createAt: number;
        updateAt: number;
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deleted: boolean;
    }>>;
    UpdateGroup(id: number, groupData: any): Promise<import("rxjs").Observable<import(".prisma/client").Group>>;
    Delete(id: number): import("rxjs").Observable<import(".prisma/client").Group>;
    GetAllGroup(limit?: number, page?: number, search?: string, order_by?: string): import("rxjs").Observable<import(".prisma/client").Group[]>;
    countGroup(): Promise<number>;
    addUserToGroup(dataAddUserToGroup: DataAddUserToGroup): Promise<import("rxjs").Observable<Prisma.BatchPayload>>;
    getOneGroupById(id: number): Promise<import("rxjs").Observable<import(".prisma/client").Group & {
        users: (import(".prisma/client").GroupUser & {
            user: {
                fullname: string;
            };
        })[];
    }>>;
}
