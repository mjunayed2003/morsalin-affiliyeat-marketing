export declare class SendMessageDto {
    sender: 'customer' | 'admin';
    senderName?: string;
    text: string;
    image?: string;
    productInfo?: {
        id?: string;
        title: string;
        price: number;
        image: string;
    };
    userId?: string;
    localId?: string;
}
