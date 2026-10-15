import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ChatMessageModel = runtime.Types.Result.DefaultSelection<Prisma.$ChatMessagePayload>;
export type AggregateChatMessage = {
    _count: ChatMessageCountAggregateOutputType | null;
    _avg: ChatMessageAvgAggregateOutputType | null;
    _sum: ChatMessageSumAggregateOutputType | null;
    _min: ChatMessageMinAggregateOutputType | null;
    _max: ChatMessageMaxAggregateOutputType | null;
};
export type ChatMessageAvgAggregateOutputType = {
    productPrice: number | null;
};
export type ChatMessageSumAggregateOutputType = {
    productPrice: number | null;
};
export type ChatMessageMinAggregateOutputType = {
    id: string | null;
    sender: string | null;
    senderName: string | null;
    text: string | null;
    image: string | null;
    productId: string | null;
    productTitle: string | null;
    productPrice: number | null;
    productImage: string | null;
    read: boolean | null;
    userId: string | null;
    createdAt: Date | null;
};
export type ChatMessageMaxAggregateOutputType = {
    id: string | null;
    sender: string | null;
    senderName: string | null;
    text: string | null;
    image: string | null;
    productId: string | null;
    productTitle: string | null;
    productPrice: number | null;
    productImage: string | null;
    read: boolean | null;
    userId: string | null;
    createdAt: Date | null;
};
export type ChatMessageCountAggregateOutputType = {
    id: number;
    sender: number;
    senderName: number;
    text: number;
    image: number;
    productId: number;
    productTitle: number;
    productPrice: number;
    productImage: number;
    read: number;
    userId: number;
    createdAt: number;
    _all: number;
};
export type ChatMessageAvgAggregateInputType = {
    productPrice?: true;
};
export type ChatMessageSumAggregateInputType = {
    productPrice?: true;
};
export type ChatMessageMinAggregateInputType = {
    id?: true;
    sender?: true;
    senderName?: true;
    text?: true;
    image?: true;
    productId?: true;
    productTitle?: true;
    productPrice?: true;
    productImage?: true;
    read?: true;
    userId?: true;
    createdAt?: true;
};
export type ChatMessageMaxAggregateInputType = {
    id?: true;
    sender?: true;
    senderName?: true;
    text?: true;
    image?: true;
    productId?: true;
    productTitle?: true;
    productPrice?: true;
    productImage?: true;
    read?: true;
    userId?: true;
    createdAt?: true;
};
export type ChatMessageCountAggregateInputType = {
    id?: true;
    sender?: true;
    senderName?: true;
    text?: true;
    image?: true;
    productId?: true;
    productTitle?: true;
    productPrice?: true;
    productImage?: true;
    read?: true;
    userId?: true;
    createdAt?: true;
    _all?: true;
};
export type ChatMessageAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChatMessageWhereInput;
    orderBy?: Prisma.ChatMessageOrderByWithRelationInput | Prisma.ChatMessageOrderByWithRelationInput[];
    cursor?: Prisma.ChatMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ChatMessageCountAggregateInputType;
    _avg?: ChatMessageAvgAggregateInputType;
    _sum?: ChatMessageSumAggregateInputType;
    _min?: ChatMessageMinAggregateInputType;
    _max?: ChatMessageMaxAggregateInputType;
};
export type GetChatMessageAggregateType<T extends ChatMessageAggregateArgs> = {
    [P in keyof T & keyof AggregateChatMessage]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateChatMessage[P]> : Prisma.GetScalarType<T[P], AggregateChatMessage[P]>;
};
export type ChatMessageGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChatMessageWhereInput;
    orderBy?: Prisma.ChatMessageOrderByWithAggregationInput | Prisma.ChatMessageOrderByWithAggregationInput[];
    by: Prisma.ChatMessageScalarFieldEnum[] | Prisma.ChatMessageScalarFieldEnum;
    having?: Prisma.ChatMessageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ChatMessageCountAggregateInputType | true;
    _avg?: ChatMessageAvgAggregateInputType;
    _sum?: ChatMessageSumAggregateInputType;
    _min?: ChatMessageMinAggregateInputType;
    _max?: ChatMessageMaxAggregateInputType;
};
export type ChatMessageGroupByOutputType = {
    id: string;
    sender: string;
    senderName: string | null;
    text: string;
    image: string | null;
    productId: string | null;
    productTitle: string | null;
    productPrice: number | null;
    productImage: string | null;
    read: boolean;
    userId: string | null;
    createdAt: Date;
    _count: ChatMessageCountAggregateOutputType | null;
    _avg: ChatMessageAvgAggregateOutputType | null;
    _sum: ChatMessageSumAggregateOutputType | null;
    _min: ChatMessageMinAggregateOutputType | null;
    _max: ChatMessageMaxAggregateOutputType | null;
};
export type GetChatMessageGroupByPayload<T extends ChatMessageGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ChatMessageGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ChatMessageGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ChatMessageGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ChatMessageGroupByOutputType[P]>;
}>>;
export type ChatMessageWhereInput = {
    AND?: Prisma.ChatMessageWhereInput | Prisma.ChatMessageWhereInput[];
    OR?: Prisma.ChatMessageWhereInput[];
    NOT?: Prisma.ChatMessageWhereInput | Prisma.ChatMessageWhereInput[];
    id?: Prisma.StringFilter<"ChatMessage"> | string;
    sender?: Prisma.StringFilter<"ChatMessage"> | string;
    senderName?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    text?: Prisma.StringFilter<"ChatMessage"> | string;
    image?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    productId?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    productTitle?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    productPrice?: Prisma.FloatNullableFilter<"ChatMessage"> | number | null;
    productImage?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    read?: Prisma.BoolFilter<"ChatMessage"> | boolean;
    userId?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"ChatMessage"> | Date | string;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type ChatMessageOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    sender?: Prisma.SortOrder;
    senderName?: Prisma.SortOrderInput | Prisma.SortOrder;
    text?: Prisma.SortOrder;
    image?: Prisma.SortOrderInput | Prisma.SortOrder;
    productId?: Prisma.SortOrderInput | Prisma.SortOrder;
    productTitle?: Prisma.SortOrderInput | Prisma.SortOrder;
    productPrice?: Prisma.SortOrderInput | Prisma.SortOrder;
    productImage?: Prisma.SortOrderInput | Prisma.SortOrder;
    read?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type ChatMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ChatMessageWhereInput | Prisma.ChatMessageWhereInput[];
    OR?: Prisma.ChatMessageWhereInput[];
    NOT?: Prisma.ChatMessageWhereInput | Prisma.ChatMessageWhereInput[];
    sender?: Prisma.StringFilter<"ChatMessage"> | string;
    senderName?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    text?: Prisma.StringFilter<"ChatMessage"> | string;
    image?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    productId?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    productTitle?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    productPrice?: Prisma.FloatNullableFilter<"ChatMessage"> | number | null;
    productImage?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    read?: Prisma.BoolFilter<"ChatMessage"> | boolean;
    userId?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"ChatMessage"> | Date | string;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id">;
export type ChatMessageOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    sender?: Prisma.SortOrder;
    senderName?: Prisma.SortOrderInput | Prisma.SortOrder;
    text?: Prisma.SortOrder;
    image?: Prisma.SortOrderInput | Prisma.SortOrder;
    productId?: Prisma.SortOrderInput | Prisma.SortOrder;
    productTitle?: Prisma.SortOrderInput | Prisma.SortOrder;
    productPrice?: Prisma.SortOrderInput | Prisma.SortOrder;
    productImage?: Prisma.SortOrderInput | Prisma.SortOrder;
    read?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ChatMessageCountOrderByAggregateInput;
    _avg?: Prisma.ChatMessageAvgOrderByAggregateInput;
    _max?: Prisma.ChatMessageMaxOrderByAggregateInput;
    _min?: Prisma.ChatMessageMinOrderByAggregateInput;
    _sum?: Prisma.ChatMessageSumOrderByAggregateInput;
};
export type ChatMessageScalarWhereWithAggregatesInput = {
    AND?: Prisma.ChatMessageScalarWhereWithAggregatesInput | Prisma.ChatMessageScalarWhereWithAggregatesInput[];
    OR?: Prisma.ChatMessageScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ChatMessageScalarWhereWithAggregatesInput | Prisma.ChatMessageScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ChatMessage"> | string;
    sender?: Prisma.StringWithAggregatesFilter<"ChatMessage"> | string;
    senderName?: Prisma.StringNullableWithAggregatesFilter<"ChatMessage"> | string | null;
    text?: Prisma.StringWithAggregatesFilter<"ChatMessage"> | string;
    image?: Prisma.StringNullableWithAggregatesFilter<"ChatMessage"> | string | null;
    productId?: Prisma.StringNullableWithAggregatesFilter<"ChatMessage"> | string | null;
    productTitle?: Prisma.StringNullableWithAggregatesFilter<"ChatMessage"> | string | null;
    productPrice?: Prisma.FloatNullableWithAggregatesFilter<"ChatMessage"> | number | null;
    productImage?: Prisma.StringNullableWithAggregatesFilter<"ChatMessage"> | string | null;
    read?: Prisma.BoolWithAggregatesFilter<"ChatMessage"> | boolean;
    userId?: Prisma.StringNullableWithAggregatesFilter<"ChatMessage"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ChatMessage"> | Date | string;
};
export type ChatMessageCreateInput = {
    id?: string;
    sender: string;
    senderName?: string | null;
    text: string;
    image?: string | null;
    productId?: string | null;
    productTitle?: string | null;
    productPrice?: number | null;
    productImage?: string | null;
    read?: boolean;
    createdAt?: Date | string;
    user?: Prisma.UserCreateNestedOneWithoutChatMessagesInput;
};
export type ChatMessageUncheckedCreateInput = {
    id?: string;
    sender: string;
    senderName?: string | null;
    text: string;
    image?: string | null;
    productId?: string | null;
    productTitle?: string | null;
    productPrice?: number | null;
    productImage?: string | null;
    read?: boolean;
    userId?: string | null;
    createdAt?: Date | string;
};
export type ChatMessageUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sender?: Prisma.StringFieldUpdateOperationsInput | string;
    senderName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productPrice?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    productImage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    read?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneWithoutChatMessagesNestedInput;
};
export type ChatMessageUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sender?: Prisma.StringFieldUpdateOperationsInput | string;
    senderName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productPrice?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    productImage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    read?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChatMessageCreateManyInput = {
    id?: string;
    sender: string;
    senderName?: string | null;
    text: string;
    image?: string | null;
    productId?: string | null;
    productTitle?: string | null;
    productPrice?: number | null;
    productImage?: string | null;
    read?: boolean;
    userId?: string | null;
    createdAt?: Date | string;
};
export type ChatMessageUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sender?: Prisma.StringFieldUpdateOperationsInput | string;
    senderName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productPrice?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    productImage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    read?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChatMessageUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sender?: Prisma.StringFieldUpdateOperationsInput | string;
    senderName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productPrice?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    productImage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    read?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChatMessageListRelationFilter = {
    every?: Prisma.ChatMessageWhereInput;
    some?: Prisma.ChatMessageWhereInput;
    none?: Prisma.ChatMessageWhereInput;
};
export type ChatMessageOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ChatMessageCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sender?: Prisma.SortOrder;
    senderName?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    image?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    productTitle?: Prisma.SortOrder;
    productPrice?: Prisma.SortOrder;
    productImage?: Prisma.SortOrder;
    read?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ChatMessageAvgOrderByAggregateInput = {
    productPrice?: Prisma.SortOrder;
};
export type ChatMessageMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sender?: Prisma.SortOrder;
    senderName?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    image?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    productTitle?: Prisma.SortOrder;
    productPrice?: Prisma.SortOrder;
    productImage?: Prisma.SortOrder;
    read?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ChatMessageMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sender?: Prisma.SortOrder;
    senderName?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    image?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    productTitle?: Prisma.SortOrder;
    productPrice?: Prisma.SortOrder;
    productImage?: Prisma.SortOrder;
    read?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ChatMessageSumOrderByAggregateInput = {
    productPrice?: Prisma.SortOrder;
};
export type ChatMessageCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ChatMessageCreateWithoutUserInput, Prisma.ChatMessageUncheckedCreateWithoutUserInput> | Prisma.ChatMessageCreateWithoutUserInput[] | Prisma.ChatMessageUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ChatMessageCreateOrConnectWithoutUserInput | Prisma.ChatMessageCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ChatMessageCreateManyUserInputEnvelope;
    connect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
};
export type ChatMessageUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ChatMessageCreateWithoutUserInput, Prisma.ChatMessageUncheckedCreateWithoutUserInput> | Prisma.ChatMessageCreateWithoutUserInput[] | Prisma.ChatMessageUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ChatMessageCreateOrConnectWithoutUserInput | Prisma.ChatMessageCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ChatMessageCreateManyUserInputEnvelope;
    connect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
};
export type ChatMessageUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ChatMessageCreateWithoutUserInput, Prisma.ChatMessageUncheckedCreateWithoutUserInput> | Prisma.ChatMessageCreateWithoutUserInput[] | Prisma.ChatMessageUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ChatMessageCreateOrConnectWithoutUserInput | Prisma.ChatMessageCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ChatMessageUpsertWithWhereUniqueWithoutUserInput | Prisma.ChatMessageUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ChatMessageCreateManyUserInputEnvelope;
    set?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    disconnect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    delete?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    connect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    update?: Prisma.ChatMessageUpdateWithWhereUniqueWithoutUserInput | Prisma.ChatMessageUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ChatMessageUpdateManyWithWhereWithoutUserInput | Prisma.ChatMessageUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ChatMessageScalarWhereInput | Prisma.ChatMessageScalarWhereInput[];
};
export type ChatMessageUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ChatMessageCreateWithoutUserInput, Prisma.ChatMessageUncheckedCreateWithoutUserInput> | Prisma.ChatMessageCreateWithoutUserInput[] | Prisma.ChatMessageUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ChatMessageCreateOrConnectWithoutUserInput | Prisma.ChatMessageCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ChatMessageUpsertWithWhereUniqueWithoutUserInput | Prisma.ChatMessageUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ChatMessageCreateManyUserInputEnvelope;
    set?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    disconnect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    delete?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    connect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    update?: Prisma.ChatMessageUpdateWithWhereUniqueWithoutUserInput | Prisma.ChatMessageUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ChatMessageUpdateManyWithWhereWithoutUserInput | Prisma.ChatMessageUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ChatMessageScalarWhereInput | Prisma.ChatMessageScalarWhereInput[];
};
export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type ChatMessageCreateWithoutUserInput = {
    id?: string;
    sender: string;
    senderName?: string | null;
    text: string;
    image?: string | null;
    productId?: string | null;
    productTitle?: string | null;
    productPrice?: number | null;
    productImage?: string | null;
    read?: boolean;
    createdAt?: Date | string;
};
export type ChatMessageUncheckedCreateWithoutUserInput = {
    id?: string;
    sender: string;
    senderName?: string | null;
    text: string;
    image?: string | null;
    productId?: string | null;
    productTitle?: string | null;
    productPrice?: number | null;
    productImage?: string | null;
    read?: boolean;
    createdAt?: Date | string;
};
export type ChatMessageCreateOrConnectWithoutUserInput = {
    where: Prisma.ChatMessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChatMessageCreateWithoutUserInput, Prisma.ChatMessageUncheckedCreateWithoutUserInput>;
};
export type ChatMessageCreateManyUserInputEnvelope = {
    data: Prisma.ChatMessageCreateManyUserInput | Prisma.ChatMessageCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type ChatMessageUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.ChatMessageWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChatMessageUpdateWithoutUserInput, Prisma.ChatMessageUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.ChatMessageCreateWithoutUserInput, Prisma.ChatMessageUncheckedCreateWithoutUserInput>;
};
export type ChatMessageUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.ChatMessageWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChatMessageUpdateWithoutUserInput, Prisma.ChatMessageUncheckedUpdateWithoutUserInput>;
};
export type ChatMessageUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.ChatMessageScalarWhereInput;
    data: Prisma.XOR<Prisma.ChatMessageUpdateManyMutationInput, Prisma.ChatMessageUncheckedUpdateManyWithoutUserInput>;
};
export type ChatMessageScalarWhereInput = {
    AND?: Prisma.ChatMessageScalarWhereInput | Prisma.ChatMessageScalarWhereInput[];
    OR?: Prisma.ChatMessageScalarWhereInput[];
    NOT?: Prisma.ChatMessageScalarWhereInput | Prisma.ChatMessageScalarWhereInput[];
    id?: Prisma.StringFilter<"ChatMessage"> | string;
    sender?: Prisma.StringFilter<"ChatMessage"> | string;
    senderName?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    text?: Prisma.StringFilter<"ChatMessage"> | string;
    image?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    productId?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    productTitle?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    productPrice?: Prisma.FloatNullableFilter<"ChatMessage"> | number | null;
    productImage?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    read?: Prisma.BoolFilter<"ChatMessage"> | boolean;
    userId?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"ChatMessage"> | Date | string;
};
export type ChatMessageCreateManyUserInput = {
    id?: string;
    sender: string;
    senderName?: string | null;
    text: string;
    image?: string | null;
    productId?: string | null;
    productTitle?: string | null;
    productPrice?: number | null;
    productImage?: string | null;
    read?: boolean;
    createdAt?: Date | string;
};
export type ChatMessageUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sender?: Prisma.StringFieldUpdateOperationsInput | string;
    senderName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productPrice?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    productImage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    read?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChatMessageUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sender?: Prisma.StringFieldUpdateOperationsInput | string;
    senderName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productPrice?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    productImage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    read?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChatMessageUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sender?: Prisma.StringFieldUpdateOperationsInput | string;
    senderName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    productPrice?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    productImage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    read?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChatMessageSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sender?: boolean;
    senderName?: boolean;
    text?: boolean;
    image?: boolean;
    productId?: boolean;
    productTitle?: boolean;
    productPrice?: boolean;
    productImage?: boolean;
    read?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.ChatMessage$userArgs<ExtArgs>;
}, ExtArgs["result"]["chatMessage"]>;
export type ChatMessageSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sender?: boolean;
    senderName?: boolean;
    text?: boolean;
    image?: boolean;
    productId?: boolean;
    productTitle?: boolean;
    productPrice?: boolean;
    productImage?: boolean;
    read?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.ChatMessage$userArgs<ExtArgs>;
}, ExtArgs["result"]["chatMessage"]>;
export type ChatMessageSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sender?: boolean;
    senderName?: boolean;
    text?: boolean;
    image?: boolean;
    productId?: boolean;
    productTitle?: boolean;
    productPrice?: boolean;
    productImage?: boolean;
    read?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.ChatMessage$userArgs<ExtArgs>;
}, ExtArgs["result"]["chatMessage"]>;
export type ChatMessageSelectScalar = {
    id?: boolean;
    sender?: boolean;
    senderName?: boolean;
    text?: boolean;
    image?: boolean;
    productId?: boolean;
    productTitle?: boolean;
    productPrice?: boolean;
    productImage?: boolean;
    read?: boolean;
    userId?: boolean;
    createdAt?: boolean;
};
export type ChatMessageOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "sender" | "senderName" | "text" | "image" | "productId" | "productTitle" | "productPrice" | "productImage" | "read" | "userId" | "createdAt", ExtArgs["result"]["chatMessage"]>;
export type ChatMessageInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.ChatMessage$userArgs<ExtArgs>;
};
export type ChatMessageIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.ChatMessage$userArgs<ExtArgs>;
};
export type ChatMessageIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.ChatMessage$userArgs<ExtArgs>;
};
export type $ChatMessagePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ChatMessage";
    objects: {
        user: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        sender: string;
        senderName: string | null;
        text: string;
        image: string | null;
        productId: string | null;
        productTitle: string | null;
        productPrice: number | null;
        productImage: string | null;
        read: boolean;
        userId: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["chatMessage"]>;
    composites: {};
};
export type ChatMessageGetPayload<S extends boolean | null | undefined | ChatMessageDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload, S>;
export type ChatMessageCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ChatMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ChatMessageCountAggregateInputType | true;
};
export interface ChatMessageDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ChatMessage'];
        meta: {
            name: 'ChatMessage';
        };
    };
    findUnique<T extends ChatMessageFindUniqueArgs>(args: Prisma.SelectSubset<T, ChatMessageFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ChatMessageFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ChatMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ChatMessageFindFirstArgs>(args?: Prisma.SelectSubset<T, ChatMessageFindFirstArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ChatMessageFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ChatMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ChatMessageFindManyArgs>(args?: Prisma.SelectSubset<T, ChatMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ChatMessageCreateArgs>(args: Prisma.SelectSubset<T, ChatMessageCreateArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ChatMessageCreateManyArgs>(args?: Prisma.SelectSubset<T, ChatMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ChatMessageCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ChatMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ChatMessageDeleteArgs>(args: Prisma.SelectSubset<T, ChatMessageDeleteArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ChatMessageUpdateArgs>(args: Prisma.SelectSubset<T, ChatMessageUpdateArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ChatMessageDeleteManyArgs>(args?: Prisma.SelectSubset<T, ChatMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ChatMessageUpdateManyArgs>(args: Prisma.SelectSubset<T, ChatMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ChatMessageUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ChatMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ChatMessageUpsertArgs>(args: Prisma.SelectSubset<T, ChatMessageUpsertArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ChatMessageCountArgs>(args?: Prisma.Subset<T, ChatMessageCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ChatMessageCountAggregateOutputType> : number>;
    aggregate<T extends ChatMessageAggregateArgs>(args: Prisma.Subset<T, ChatMessageAggregateArgs>): Prisma.PrismaPromise<GetChatMessageAggregateType<T>>;
    groupBy<T extends ChatMessageGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ChatMessageGroupByArgs['orderBy'];
    } : {
        orderBy?: ChatMessageGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ChatMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ChatMessageFieldRefs;
}
export interface Prisma__ChatMessageClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.ChatMessage$userArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ChatMessage$userArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ChatMessageFieldRefs {
    readonly id: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly sender: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly senderName: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly text: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly image: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly productId: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly productTitle: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly productPrice: Prisma.FieldRef<"ChatMessage", 'Float'>;
    readonly productImage: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly read: Prisma.FieldRef<"ChatMessage", 'Boolean'>;
    readonly userId: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly createdAt: Prisma.FieldRef<"ChatMessage", 'DateTime'>;
}
export type ChatMessageFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    where: Prisma.ChatMessageWhereUniqueInput;
};
export type ChatMessageFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    where: Prisma.ChatMessageWhereUniqueInput;
};
export type ChatMessageFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    where?: Prisma.ChatMessageWhereInput;
    orderBy?: Prisma.ChatMessageOrderByWithRelationInput | Prisma.ChatMessageOrderByWithRelationInput[];
    cursor?: Prisma.ChatMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChatMessageScalarFieldEnum | Prisma.ChatMessageScalarFieldEnum[];
};
export type ChatMessageFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    where?: Prisma.ChatMessageWhereInput;
    orderBy?: Prisma.ChatMessageOrderByWithRelationInput | Prisma.ChatMessageOrderByWithRelationInput[];
    cursor?: Prisma.ChatMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChatMessageScalarFieldEnum | Prisma.ChatMessageScalarFieldEnum[];
};
export type ChatMessageFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    where?: Prisma.ChatMessageWhereInput;
    orderBy?: Prisma.ChatMessageOrderByWithRelationInput | Prisma.ChatMessageOrderByWithRelationInput[];
    cursor?: Prisma.ChatMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChatMessageScalarFieldEnum | Prisma.ChatMessageScalarFieldEnum[];
};
export type ChatMessageCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChatMessageCreateInput, Prisma.ChatMessageUncheckedCreateInput>;
};
export type ChatMessageCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ChatMessageCreateManyInput | Prisma.ChatMessageCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ChatMessageCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    data: Prisma.ChatMessageCreateManyInput | Prisma.ChatMessageCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ChatMessageIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ChatMessageUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChatMessageUpdateInput, Prisma.ChatMessageUncheckedUpdateInput>;
    where: Prisma.ChatMessageWhereUniqueInput;
};
export type ChatMessageUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ChatMessageUpdateManyMutationInput, Prisma.ChatMessageUncheckedUpdateManyInput>;
    where?: Prisma.ChatMessageWhereInput;
    limit?: number;
};
export type ChatMessageUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChatMessageUpdateManyMutationInput, Prisma.ChatMessageUncheckedUpdateManyInput>;
    where?: Prisma.ChatMessageWhereInput;
    limit?: number;
    include?: Prisma.ChatMessageIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ChatMessageUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    where: Prisma.ChatMessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChatMessageCreateInput, Prisma.ChatMessageUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ChatMessageUpdateInput, Prisma.ChatMessageUncheckedUpdateInput>;
};
export type ChatMessageDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    where: Prisma.ChatMessageWhereUniqueInput;
};
export type ChatMessageDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChatMessageWhereInput;
    limit?: number;
};
export type ChatMessage$userArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type ChatMessageDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
};
