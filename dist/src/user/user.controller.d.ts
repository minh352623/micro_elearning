/// <reference types="multer" />
import { UserDTO } from './user.dto';
import { UserService } from './user.service';
import { CloudinaryService } from 'src/cloundinay/cloudinary.service';
export declare class UserController {
    private readonly userService;
    private readonly cloudinaryService;
    constructor(userService: UserService, cloudinaryService: CloudinaryService);
    createUser(avatar: Express.Multer.File, userDTO: UserDTO): Promise<import("rxjs").Observable<{
        msg: string;
        data: {
            createAt: number;
            updateAt: number;
            id: number;
            fullname: string;
            avatar: string;
            address: string;
            phone: string;
            age: number;
            email: string;
            password: string;
            twoFactorAuthenticationSecret: string;
            isTwoFactorAuthenticationEnabled: boolean;
            createdAt: Date;
            updatedAt: Date;
            deleted: boolean;
        };
    }>>;
    createManyUser(fileUsers: Express.Multer.File): Promise<{
        msg: string;
    }>;
    getProfile(req: any): Promise<any>;
    updateUser(id: number, userDTO: any): Promise<import("rxjs").Observable<{
        msg: string;
        data: {
            id: number;
            fullname: string;
            avatar: string;
            address: string;
            phone: string;
            age: number;
            email: string;
            password: string;
            twoFactorAuthenticationSecret: string;
            isTwoFactorAuthenticationEnabled: boolean;
            createdAt: Date;
            updatedAt: Date;
            deleted: boolean;
        };
    }>>;
    forgotPassword(req: any): Promise<{
        message: string;
    }>;
    changePassword(req: any): Promise<{
        message: string;
    }>;
    deleteUserById(id: number): import("rxjs").Observable<{
        msg: string;
        data: {
            createAt: number;
            updateAt: number;
            id: number;
            fullname: string;
            avatar: string;
            address: string;
            phone: string;
            age: number;
            email: string;
            password: string;
            twoFactorAuthenticationSecret: string;
            isTwoFactorAuthenticationEnabled: boolean;
            createdAt: Date;
            updatedAt: Date;
            deleted: boolean;
        };
    }>;
    getPaginaion(limit?: number, page?: number, search?: string, order_by?: string): Promise<import("rxjs").Observable<{
        totalRow: number;
        msg: string;
        data: {
            createAt: number;
            updateAt: number;
            id: number;
            fullname: string;
            avatar: string;
            address: string;
            phone: string;
            age: number;
            email: string;
            password: string;
            twoFactorAuthenticationSecret: string;
            isTwoFactorAuthenticationEnabled: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>>;
    getAllGroupOfUser(id: number): Promise<import("rxjs").Observable<{
        msg: string;
        data: {
            email: string;
            fullname: string;
            groups: {
                group: {
                    name: string;
                };
                groupId: number;
            }[];
        };
    }>>;
}
