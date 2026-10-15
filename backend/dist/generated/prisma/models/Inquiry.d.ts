import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type InquiryModel = runtime.Types.Result.DefaultSelection<Prisma.$InquiryPayload>;
export type AggregateInquiry = {
    _count: InquiryCountAggregateOutputType | null;
    _min: InquiryMinAggregateOutputType | null;
    _max: InquiryMaxAggregateOutputType | null;
};
export type InquiryMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    productId: string | null;
    status: $Enums.InquiryStatus | null;
    amazonOrderId: string | null;
    reviewUrl: string | null;
    notes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type InquiryMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    productId: string | null;
    status: $Enums.InquiryStatus | null;
    amazonOrderId: string | null;
    reviewUrl: string | null;
    notes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type InquiryCountAggregateOutputType = {
    id: number;
    userId: number;
    productId: number;
    status: number;
    amazonOrderId: number;
    reviewUrl: number;
    notes: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type InquiryMinAggregateInputType = {
    id?: true;
    userId?: true;
    productId?: true;
    status?: true;
    amazonOrderId?: true;
    reviewUrl?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type InquiryMaxAggregateInputType = {
    id?: true;
    userId?: true;
    productId?: true;
    status?: true;
    amazonOrderId?: true;
    reviewUrl?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type InquiryCountAggregateInputType = {
    id?: true;
    userId?: true;
    productId?: true;
    status?: true;
    amazonOrderId?: true;
    reviewUrl?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type InquiryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InquiryWhereInput;
    orderBy?: Prisma.InquiryOrderByWithRelationInput | Prisma.InquiryOrderByWithRelationInput[];
    cursor?: Prisma.InquiryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | InquiryCountAggregateInputType;
    _min?: InquiryMinAggregateInputType;
    _max?: InquiryMaxAggregateInputType;
};
export type GetInquiryAggregateType<T extends InquiryAggregateArgs> = {
    [P in keyof T & keyof AggregateInquiry]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateInquiry[P]> : Prisma.GetScalarType<T[P], AggregateInquiry[P]>;
};
export type InquiryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InquiryWhereInput;
    orderBy?: Prisma.InquiryOrderByWithAggregationInput | Prisma.InquiryOrderByWithAggregationInput[];
    by: Prisma.InquiryScalarFieldEnum[] | Prisma.InquiryScalarFieldEnum;
    having?: Prisma.InquiryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: InquiryCountAggregateInputType | true;
    _min?: InquiryMinAggregateInputType;
    _max?: InquiryMaxAggregateInputType;
};
export type InquiryGroupByOutputType = {
    id: string;
    userId: string;
    productId: string;
    status: $Enums.InquiryStatus;
    amazonOrderId: string | null;
    reviewUrl: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: InquiryCountAggregateOutputType | null;
    _min: InquiryMinAggregateOutputType | null;
    _max: InquiryMaxAggregateOutputType | null;
};
export type GetInquiryGroupByPayload<T extends InquiryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<InquiryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof InquiryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], InquiryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], InquiryGroupByOutputType[P]>;
}>>;
export type InquiryWhereInput = {
    AND?: Prisma.InquiryWhereInput | Prisma.InquiryWhereInput[];
    OR?: Prisma.InquiryWhereInput[];
    NOT?: Prisma.InquiryWhereInput | Prisma.InquiryWhereInput[];
    id?: Prisma.StringFilter<"Inquiry"> | string;
    userId?: Prisma.StringFilter<"Inquiry"> | string;
    productId?: Prisma.StringFilter<"Inquiry"> | string;
    status?: Prisma.EnumInquiryStatusFilter<"Inquiry"> | $Enums.InquiryStatus;
    amazonOrderId?: Prisma.StringNullableFilter<"Inquiry"> | string | null;
    reviewUrl?: Prisma.StringNullableFilter<"Inquiry"> | string | null;
    notes?: Prisma.StringNullableFilter<"Inquiry"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Inquiry"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Inquiry"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    product?: Prisma.XOR<Prisma.ProductScalarRelationFilter, Prisma.ProductWhereInput>;
};
export type InquiryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    amazonOrderId?: Prisma.SortOrderInput | Prisma.SortOrder;
    reviewUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    product?: Prisma.ProductOrderByWithRelationInput;
};
export type InquiryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.InquiryWhereInput | Prisma.InquiryWhereInput[];
    OR?: Prisma.InquiryWhereInput[];
    NOT?: Prisma.InquiryWhereInput | Prisma.InquiryWhereInput[];
    userId?: Prisma.StringFilter<"Inquiry"> | string;
    productId?: Prisma.StringFilter<"Inquiry"> | string;
    status?: Prisma.EnumInquiryStatusFilter<"Inquiry"> | $Enums.InquiryStatus;
    amazonOrderId?: Prisma.StringNullableFilter<"Inquiry"> | string | null;
    reviewUrl?: Prisma.StringNullableFilter<"Inquiry"> | string | null;
    notes?: Prisma.StringNullableFilter<"Inquiry"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Inquiry"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Inquiry"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    product?: Prisma.XOR<Prisma.ProductScalarRelationFilter, Prisma.ProductWhereInput>;
}, "id">;
export type InquiryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    amazonOrderId?: Prisma.SortOrderInput | Prisma.SortOrder;
    reviewUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.InquiryCountOrderByAggregateInput;
    _max?: Prisma.InquiryMaxOrderByAggregateInput;
    _min?: Prisma.InquiryMinOrderByAggregateInput;
};
export type InquiryScalarWhereWithAggregatesInput = {
    AND?: Prisma.InquiryScalarWhereWithAggregatesInput | Prisma.InquiryScalarWhereWithAggregatesInput[];
    OR?: Prisma.InquiryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.InquiryScalarWhereWithAggregatesInput | Prisma.InquiryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Inquiry"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"Inquiry"> | string;
    productId?: Prisma.StringWithAggregatesFilter<"Inquiry"> | string;
    status?: Prisma.EnumInquiryStatusWithAggregatesFilter<"Inquiry"> | $Enums.InquiryStatus;
    amazonOrderId?: Prisma.StringNullableWithAggregatesFilter<"Inquiry"> | string | null;
    reviewUrl?: Prisma.StringNullableWithAggregatesFilter<"Inquiry"> | string | null;
    notes?: Prisma.StringNullableWithAggregatesFilter<"Inquiry"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Inquiry"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Inquiry"> | Date | string;
};
export type InquiryCreateInput = {
    id?: string;
    status?: $Enums.InquiryStatus;
    amazonOrderId?: string | null;
    reviewUrl?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutInquiriesInput;
    product: Prisma.ProductCreateNestedOneWithoutInquiriesInput;
};
export type InquiryUncheckedCreateInput = {
    id?: string;
    userId: string;
    productId: string;
    status?: $Enums.InquiryStatus;
    amazonOrderId?: string | null;
    reviewUrl?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type InquiryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus;
    amazonOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutInquiriesNestedInput;
    product?: Prisma.ProductUpdateOneRequiredWithoutInquiriesNestedInput;
};
export type InquiryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus;
    amazonOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InquiryCreateManyInput = {
    id?: string;
    userId: string;
    productId: string;
    status?: $Enums.InquiryStatus;
    amazonOrderId?: string | null;
    reviewUrl?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type InquiryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus;
    amazonOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InquiryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus;
    amazonOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InquiryListRelationFilter = {
    every?: Prisma.InquiryWhereInput;
    some?: Prisma.InquiryWhereInput;
    none?: Prisma.InquiryWhereInput;
};
export type InquiryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type InquiryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    amazonOrderId?: Prisma.SortOrder;
    reviewUrl?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type InquiryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    amazonOrderId?: Prisma.SortOrder;
    reviewUrl?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type InquiryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    amazonOrderId?: Prisma.SortOrder;
    reviewUrl?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type InquiryCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.InquiryCreateWithoutUserInput, Prisma.InquiryUncheckedCreateWithoutUserInput> | Prisma.InquiryCreateWithoutUserInput[] | Prisma.InquiryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.InquiryCreateOrConnectWithoutUserInput | Prisma.InquiryCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.InquiryCreateManyUserInputEnvelope;
    connect?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
};
export type InquiryUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.InquiryCreateWithoutUserInput, Prisma.InquiryUncheckedCreateWithoutUserInput> | Prisma.InquiryCreateWithoutUserInput[] | Prisma.InquiryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.InquiryCreateOrConnectWithoutUserInput | Prisma.InquiryCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.InquiryCreateManyUserInputEnvelope;
    connect?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
};
export type InquiryUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.InquiryCreateWithoutUserInput, Prisma.InquiryUncheckedCreateWithoutUserInput> | Prisma.InquiryCreateWithoutUserInput[] | Prisma.InquiryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.InquiryCreateOrConnectWithoutUserInput | Prisma.InquiryCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.InquiryUpsertWithWhereUniqueWithoutUserInput | Prisma.InquiryUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.InquiryCreateManyUserInputEnvelope;
    set?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
    disconnect?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
    delete?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
    connect?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
    update?: Prisma.InquiryUpdateWithWhereUniqueWithoutUserInput | Prisma.InquiryUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.InquiryUpdateManyWithWhereWithoutUserInput | Prisma.InquiryUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.InquiryScalarWhereInput | Prisma.InquiryScalarWhereInput[];
};
export type InquiryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.InquiryCreateWithoutUserInput, Prisma.InquiryUncheckedCreateWithoutUserInput> | Prisma.InquiryCreateWithoutUserInput[] | Prisma.InquiryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.InquiryCreateOrConnectWithoutUserInput | Prisma.InquiryCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.InquiryUpsertWithWhereUniqueWithoutUserInput | Prisma.InquiryUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.InquiryCreateManyUserInputEnvelope;
    set?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
    disconnect?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
    delete?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
    connect?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
    update?: Prisma.InquiryUpdateWithWhereUniqueWithoutUserInput | Prisma.InquiryUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.InquiryUpdateManyWithWhereWithoutUserInput | Prisma.InquiryUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.InquiryScalarWhereInput | Prisma.InquiryScalarWhereInput[];
};
export type InquiryCreateNestedManyWithoutProductInput = {
    create?: Prisma.XOR<Prisma.InquiryCreateWithoutProductInput, Prisma.InquiryUncheckedCreateWithoutProductInput> | Prisma.InquiryCreateWithoutProductInput[] | Prisma.InquiryUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.InquiryCreateOrConnectWithoutProductInput | Prisma.InquiryCreateOrConnectWithoutProductInput[];
    createMany?: Prisma.InquiryCreateManyProductInputEnvelope;
    connect?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
};
export type InquiryUncheckedCreateNestedManyWithoutProductInput = {
    create?: Prisma.XOR<Prisma.InquiryCreateWithoutProductInput, Prisma.InquiryUncheckedCreateWithoutProductInput> | Prisma.InquiryCreateWithoutProductInput[] | Prisma.InquiryUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.InquiryCreateOrConnectWithoutProductInput | Prisma.InquiryCreateOrConnectWithoutProductInput[];
    createMany?: Prisma.InquiryCreateManyProductInputEnvelope;
    connect?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
};
export type InquiryUpdateManyWithoutProductNestedInput = {
    create?: Prisma.XOR<Prisma.InquiryCreateWithoutProductInput, Prisma.InquiryUncheckedCreateWithoutProductInput> | Prisma.InquiryCreateWithoutProductInput[] | Prisma.InquiryUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.InquiryCreateOrConnectWithoutProductInput | Prisma.InquiryCreateOrConnectWithoutProductInput[];
    upsert?: Prisma.InquiryUpsertWithWhereUniqueWithoutProductInput | Prisma.InquiryUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: Prisma.InquiryCreateManyProductInputEnvelope;
    set?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
    disconnect?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
    delete?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
    connect?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
    update?: Prisma.InquiryUpdateWithWhereUniqueWithoutProductInput | Prisma.InquiryUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?: Prisma.InquiryUpdateManyWithWhereWithoutProductInput | Prisma.InquiryUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: Prisma.InquiryScalarWhereInput | Prisma.InquiryScalarWhereInput[];
};
export type InquiryUncheckedUpdateManyWithoutProductNestedInput = {
    create?: Prisma.XOR<Prisma.InquiryCreateWithoutProductInput, Prisma.InquiryUncheckedCreateWithoutProductInput> | Prisma.InquiryCreateWithoutProductInput[] | Prisma.InquiryUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.InquiryCreateOrConnectWithoutProductInput | Prisma.InquiryCreateOrConnectWithoutProductInput[];
    upsert?: Prisma.InquiryUpsertWithWhereUniqueWithoutProductInput | Prisma.InquiryUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: Prisma.InquiryCreateManyProductInputEnvelope;
    set?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
    disconnect?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
    delete?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
    connect?: Prisma.InquiryWhereUniqueInput | Prisma.InquiryWhereUniqueInput[];
    update?: Prisma.InquiryUpdateWithWhereUniqueWithoutProductInput | Prisma.InquiryUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?: Prisma.InquiryUpdateManyWithWhereWithoutProductInput | Prisma.InquiryUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: Prisma.InquiryScalarWhereInput | Prisma.InquiryScalarWhereInput[];
};
export type EnumInquiryStatusFieldUpdateOperationsInput = {
    set?: $Enums.InquiryStatus;
};
export type InquiryCreateWithoutUserInput = {
    id?: string;
    status?: $Enums.InquiryStatus;
    amazonOrderId?: string | null;
    reviewUrl?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    product: Prisma.ProductCreateNestedOneWithoutInquiriesInput;
};
export type InquiryUncheckedCreateWithoutUserInput = {
    id?: string;
    productId: string;
    status?: $Enums.InquiryStatus;
    amazonOrderId?: string | null;
    reviewUrl?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type InquiryCreateOrConnectWithoutUserInput = {
    where: Prisma.InquiryWhereUniqueInput;
    create: Prisma.XOR<Prisma.InquiryCreateWithoutUserInput, Prisma.InquiryUncheckedCreateWithoutUserInput>;
};
export type InquiryCreateManyUserInputEnvelope = {
    data: Prisma.InquiryCreateManyUserInput | Prisma.InquiryCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type InquiryUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.InquiryWhereUniqueInput;
    update: Prisma.XOR<Prisma.InquiryUpdateWithoutUserInput, Prisma.InquiryUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.InquiryCreateWithoutUserInput, Prisma.InquiryUncheckedCreateWithoutUserInput>;
};
export type InquiryUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.InquiryWhereUniqueInput;
    data: Prisma.XOR<Prisma.InquiryUpdateWithoutUserInput, Prisma.InquiryUncheckedUpdateWithoutUserInput>;
};
export type InquiryUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.InquiryScalarWhereInput;
    data: Prisma.XOR<Prisma.InquiryUpdateManyMutationInput, Prisma.InquiryUncheckedUpdateManyWithoutUserInput>;
};
export type InquiryScalarWhereInput = {
    AND?: Prisma.InquiryScalarWhereInput | Prisma.InquiryScalarWhereInput[];
    OR?: Prisma.InquiryScalarWhereInput[];
    NOT?: Prisma.InquiryScalarWhereInput | Prisma.InquiryScalarWhereInput[];
    id?: Prisma.StringFilter<"Inquiry"> | string;
    userId?: Prisma.StringFilter<"Inquiry"> | string;
    productId?: Prisma.StringFilter<"Inquiry"> | string;
    status?: Prisma.EnumInquiryStatusFilter<"Inquiry"> | $Enums.InquiryStatus;
    amazonOrderId?: Prisma.StringNullableFilter<"Inquiry"> | string | null;
    reviewUrl?: Prisma.StringNullableFilter<"Inquiry"> | string | null;
    notes?: Prisma.StringNullableFilter<"Inquiry"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Inquiry"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Inquiry"> | Date | string;
};
export type InquiryCreateWithoutProductInput = {
    id?: string;
    status?: $Enums.InquiryStatus;
    amazonOrderId?: string | null;
    reviewUrl?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutInquiriesInput;
};
export type InquiryUncheckedCreateWithoutProductInput = {
    id?: string;
    userId: string;
    status?: $Enums.InquiryStatus;
    amazonOrderId?: string | null;
    reviewUrl?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type InquiryCreateOrConnectWithoutProductInput = {
    where: Prisma.InquiryWhereUniqueInput;
    create: Prisma.XOR<Prisma.InquiryCreateWithoutProductInput, Prisma.InquiryUncheckedCreateWithoutProductInput>;
};
export type InquiryCreateManyProductInputEnvelope = {
    data: Prisma.InquiryCreateManyProductInput | Prisma.InquiryCreateManyProductInput[];
    skipDuplicates?: boolean;
};
export type InquiryUpsertWithWhereUniqueWithoutProductInput = {
    where: Prisma.InquiryWhereUniqueInput;
    update: Prisma.XOR<Prisma.InquiryUpdateWithoutProductInput, Prisma.InquiryUncheckedUpdateWithoutProductInput>;
    create: Prisma.XOR<Prisma.InquiryCreateWithoutProductInput, Prisma.InquiryUncheckedCreateWithoutProductInput>;
};
export type InquiryUpdateWithWhereUniqueWithoutProductInput = {
    where: Prisma.InquiryWhereUniqueInput;
    data: Prisma.XOR<Prisma.InquiryUpdateWithoutProductInput, Prisma.InquiryUncheckedUpdateWithoutProductInput>;
};
export type InquiryUpdateManyWithWhereWithoutProductInput = {
    where: Prisma.InquiryScalarWhereInput;
    data: Prisma.XOR<Prisma.InquiryUpdateManyMutationInput, Prisma.InquiryUncheckedUpdateManyWithoutProductInput>;
};
export type InquiryCreateManyUserInput = {
    id?: string;
    productId: string;
    status?: $Enums.InquiryStatus;
    amazonOrderId?: string | null;
    reviewUrl?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type InquiryUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus;
    amazonOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    product?: Prisma.ProductUpdateOneRequiredWithoutInquiriesNestedInput;
};
export type InquiryUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus;
    amazonOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InquiryUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus;
    amazonOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InquiryCreateManyProductInput = {
    id?: string;
    userId: string;
    status?: $Enums.InquiryStatus;
    amazonOrderId?: string | null;
    reviewUrl?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type InquiryUpdateWithoutProductInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus;
    amazonOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutInquiriesNestedInput;
};
export type InquiryUncheckedUpdateWithoutProductInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus;
    amazonOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InquiryUncheckedUpdateManyWithoutProductInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus;
    amazonOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InquirySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    productId?: boolean;
    status?: boolean;
    amazonOrderId?: boolean;
    reviewUrl?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["inquiry"]>;
export type InquirySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    productId?: boolean;
    status?: boolean;
    amazonOrderId?: boolean;
    reviewUrl?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["inquiry"]>;
export type InquirySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    productId?: boolean;
    status?: boolean;
    amazonOrderId?: boolean;
    reviewUrl?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["inquiry"]>;
export type InquirySelectScalar = {
    id?: boolean;
    userId?: boolean;
    productId?: boolean;
    status?: boolean;
    amazonOrderId?: boolean;
    reviewUrl?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type InquiryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "productId" | "status" | "amazonOrderId" | "reviewUrl" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["inquiry"]>;
export type InquiryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
};
export type InquiryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
};
export type InquiryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
};
export type $InquiryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Inquiry";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        product: Prisma.$ProductPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        productId: string;
        status: $Enums.InquiryStatus;
        amazonOrderId: string | null;
        reviewUrl: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["inquiry"]>;
    composites: {};
};
export type InquiryGetPayload<S extends boolean | null | undefined | InquiryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$InquiryPayload, S>;
export type InquiryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<InquiryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: InquiryCountAggregateInputType | true;
};
export interface InquiryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Inquiry'];
        meta: {
            name: 'Inquiry';
        };
    };
    findUnique<T extends InquiryFindUniqueArgs>(args: Prisma.SelectSubset<T, InquiryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__InquiryClient<runtime.Types.Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends InquiryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, InquiryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__InquiryClient<runtime.Types.Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends InquiryFindFirstArgs>(args?: Prisma.SelectSubset<T, InquiryFindFirstArgs<ExtArgs>>): Prisma.Prisma__InquiryClient<runtime.Types.Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends InquiryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, InquiryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__InquiryClient<runtime.Types.Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends InquiryFindManyArgs>(args?: Prisma.SelectSubset<T, InquiryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends InquiryCreateArgs>(args: Prisma.SelectSubset<T, InquiryCreateArgs<ExtArgs>>): Prisma.Prisma__InquiryClient<runtime.Types.Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends InquiryCreateManyArgs>(args?: Prisma.SelectSubset<T, InquiryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends InquiryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, InquiryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends InquiryDeleteArgs>(args: Prisma.SelectSubset<T, InquiryDeleteArgs<ExtArgs>>): Prisma.Prisma__InquiryClient<runtime.Types.Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends InquiryUpdateArgs>(args: Prisma.SelectSubset<T, InquiryUpdateArgs<ExtArgs>>): Prisma.Prisma__InquiryClient<runtime.Types.Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends InquiryDeleteManyArgs>(args?: Prisma.SelectSubset<T, InquiryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends InquiryUpdateManyArgs>(args: Prisma.SelectSubset<T, InquiryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends InquiryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, InquiryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends InquiryUpsertArgs>(args: Prisma.SelectSubset<T, InquiryUpsertArgs<ExtArgs>>): Prisma.Prisma__InquiryClient<runtime.Types.Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends InquiryCountArgs>(args?: Prisma.Subset<T, InquiryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], InquiryCountAggregateOutputType> : number>;
    aggregate<T extends InquiryAggregateArgs>(args: Prisma.Subset<T, InquiryAggregateArgs>): Prisma.PrismaPromise<GetInquiryAggregateType<T>>;
    groupBy<T extends InquiryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: InquiryGroupByArgs['orderBy'];
    } : {
        orderBy?: InquiryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, InquiryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInquiryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: InquiryFieldRefs;
}
export interface Prisma__InquiryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    product<T extends Prisma.ProductDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProductDefaultArgs<ExtArgs>>): Prisma.Prisma__ProductClient<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface InquiryFieldRefs {
    readonly id: Prisma.FieldRef<"Inquiry", 'String'>;
    readonly userId: Prisma.FieldRef<"Inquiry", 'String'>;
    readonly productId: Prisma.FieldRef<"Inquiry", 'String'>;
    readonly status: Prisma.FieldRef<"Inquiry", 'InquiryStatus'>;
    readonly amazonOrderId: Prisma.FieldRef<"Inquiry", 'String'>;
    readonly reviewUrl: Prisma.FieldRef<"Inquiry", 'String'>;
    readonly notes: Prisma.FieldRef<"Inquiry", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Inquiry", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Inquiry", 'DateTime'>;
}
export type InquiryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InquirySelect<ExtArgs> | null;
    omit?: Prisma.InquiryOmit<ExtArgs> | null;
    include?: Prisma.InquiryInclude<ExtArgs> | null;
    where: Prisma.InquiryWhereUniqueInput;
};
export type InquiryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InquirySelect<ExtArgs> | null;
    omit?: Prisma.InquiryOmit<ExtArgs> | null;
    include?: Prisma.InquiryInclude<ExtArgs> | null;
    where: Prisma.InquiryWhereUniqueInput;
};
export type InquiryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InquirySelect<ExtArgs> | null;
    omit?: Prisma.InquiryOmit<ExtArgs> | null;
    include?: Prisma.InquiryInclude<ExtArgs> | null;
    where?: Prisma.InquiryWhereInput;
    orderBy?: Prisma.InquiryOrderByWithRelationInput | Prisma.InquiryOrderByWithRelationInput[];
    cursor?: Prisma.InquiryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InquiryScalarFieldEnum | Prisma.InquiryScalarFieldEnum[];
};
export type InquiryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InquirySelect<ExtArgs> | null;
    omit?: Prisma.InquiryOmit<ExtArgs> | null;
    include?: Prisma.InquiryInclude<ExtArgs> | null;
    where?: Prisma.InquiryWhereInput;
    orderBy?: Prisma.InquiryOrderByWithRelationInput | Prisma.InquiryOrderByWithRelationInput[];
    cursor?: Prisma.InquiryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InquiryScalarFieldEnum | Prisma.InquiryScalarFieldEnum[];
};
export type InquiryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InquirySelect<ExtArgs> | null;
    omit?: Prisma.InquiryOmit<ExtArgs> | null;
    include?: Prisma.InquiryInclude<ExtArgs> | null;
    where?: Prisma.InquiryWhereInput;
    orderBy?: Prisma.InquiryOrderByWithRelationInput | Prisma.InquiryOrderByWithRelationInput[];
    cursor?: Prisma.InquiryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InquiryScalarFieldEnum | Prisma.InquiryScalarFieldEnum[];
};
export type InquiryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InquirySelect<ExtArgs> | null;
    omit?: Prisma.InquiryOmit<ExtArgs> | null;
    include?: Prisma.InquiryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InquiryCreateInput, Prisma.InquiryUncheckedCreateInput>;
};
export type InquiryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.InquiryCreateManyInput | Prisma.InquiryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type InquiryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InquirySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.InquiryOmit<ExtArgs> | null;
    data: Prisma.InquiryCreateManyInput | Prisma.InquiryCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.InquiryIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type InquiryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InquirySelect<ExtArgs> | null;
    omit?: Prisma.InquiryOmit<ExtArgs> | null;
    include?: Prisma.InquiryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InquiryUpdateInput, Prisma.InquiryUncheckedUpdateInput>;
    where: Prisma.InquiryWhereUniqueInput;
};
export type InquiryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.InquiryUpdateManyMutationInput, Prisma.InquiryUncheckedUpdateManyInput>;
    where?: Prisma.InquiryWhereInput;
    limit?: number;
};
export type InquiryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InquirySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.InquiryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InquiryUpdateManyMutationInput, Prisma.InquiryUncheckedUpdateManyInput>;
    where?: Prisma.InquiryWhereInput;
    limit?: number;
    include?: Prisma.InquiryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type InquiryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InquirySelect<ExtArgs> | null;
    omit?: Prisma.InquiryOmit<ExtArgs> | null;
    include?: Prisma.InquiryInclude<ExtArgs> | null;
    where: Prisma.InquiryWhereUniqueInput;
    create: Prisma.XOR<Prisma.InquiryCreateInput, Prisma.InquiryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.InquiryUpdateInput, Prisma.InquiryUncheckedUpdateInput>;
};
export type InquiryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InquirySelect<ExtArgs> | null;
    omit?: Prisma.InquiryOmit<ExtArgs> | null;
    include?: Prisma.InquiryInclude<ExtArgs> | null;
    where: Prisma.InquiryWhereUniqueInput;
};
export type InquiryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InquiryWhereInput;
    limit?: number;
};
export type InquiryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InquirySelect<ExtArgs> | null;
    omit?: Prisma.InquiryOmit<ExtArgs> | null;
    include?: Prisma.InquiryInclude<ExtArgs> | null;
};
