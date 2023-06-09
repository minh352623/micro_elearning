import 'dotenv/config';
export declare const CloudinaryProvider: {
    provide: string;
    useFactory: () => import("cloudinary").ConfigOptions;
};
