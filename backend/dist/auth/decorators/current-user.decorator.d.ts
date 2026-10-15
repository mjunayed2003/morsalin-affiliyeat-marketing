export interface AuthenticatedUser {
    id: string;
    phone: string;
    role: 'CLIENT' | 'ADMIN';
    email?: string;
    name?: string;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
