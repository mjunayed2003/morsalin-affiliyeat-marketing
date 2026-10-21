import * as runtime from "@prisma/client/runtime/index-browser";
export const Decimal = runtime.Decimal;
export const NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
export const DbNull = runtime.DbNull;
export const JsonNull = runtime.JsonNull;
export const AnyNull = runtime.AnyNull;
export const ModelName = {
    User: 'User',
    EmailOtp: 'EmailOtp',
    Product: 'Product',
    ChatMessage: 'ChatMessage',
    Inquiry: 'Inquiry',
    Review: 'Review'
};
export const TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
export const UserScalarFieldEnum = {
    id: 'id',
    phone: 'phone',
    name: 'name',
    password: 'password',
    email: 'email',
    address: 'address',
    city: 'city',
    avatar: 'avatar',
    selfieImage: 'selfieImage',
    amazonProfileUrl: 'amazonProfileUrl',
    paypalEmail: 'paypalEmail',
    fcmToken: 'fcmToken',
    verified: 'verified',
    verifiedAt: 'verifiedAt',
    role: 'role',
    canReview: 'canReview',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const EmailOtpScalarFieldEnum = {
    id: 'id',
    email: 'email',
    code: 'code',
    type: 'type',
    data: 'data',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
};
export const ProductScalarFieldEnum = {
    id: 'id',
    title: 'title',
    description: 'description',
    category: 'category',
    subCategory: 'subCategory',
    price: 'price',
    originalPrice: 'originalPrice',
    commission: 'commission',
    commissionAmount: 'commissionAmount',
    image: 'image',
    gallery: 'gallery',
    affiliateCode: 'affiliateCode',
    features: 'features',
    rating: 'rating',
    reviewsCount: 'reviewsCount',
    badge: 'badge',
    inStock: 'inStock',
    store: 'store',
    amazonUrl: 'amazonUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const ChatMessageScalarFieldEnum = {
    id: 'id',
    sender: 'sender',
    senderName: 'senderName',
    text: 'text',
    image: 'image',
    productId: 'productId',
    productTitle: 'productTitle',
    productPrice: 'productPrice',
    productImage: 'productImage',
    read: 'read',
    userId: 'userId',
    createdAt: 'createdAt'
};
export const InquiryScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    productId: 'productId',
    status: 'status',
    amazonOrderId: 'amazonOrderId',
    reviewUrl: 'reviewUrl',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const ReviewScalarFieldEnum = {
    id: 'id',
    productId: 'productId',
    userId: 'userId',
    userName: 'userName',
    rating: 'rating',
    title: 'title',
    comment: 'comment',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
export const QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
export const NullsOrder = {
    first: 'first',
    last: 'last'
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map