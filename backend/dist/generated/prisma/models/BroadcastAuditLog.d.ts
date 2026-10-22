import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type BroadcastAuditLogModel = runtime.Types.Result.DefaultSelection<Prisma.$BroadcastAuditLogPayload>;
export type AggregateBroadcastAuditLog = {
    _count: BroadcastAuditLogCountAggregateOutputType | null;
    _avg: BroadcastAuditLogAvgAggregateOutputType | null;
    _sum: BroadcastAuditLogSumAggregateOutputType | null;
    _min: BroadcastAuditLogMinAggregateOutputType | null;
    _max: BroadcastAuditLogMaxAggregateOutputType | null;
};
export type BroadcastAuditLogAvgAggregateOutputType = {
    recipientsCount: number | null;
    fcmSuccessCount: number | null;
    fcmFailureCount: number | null;
};
export type BroadcastAuditLogSumAggregateOutputType = {
    recipientsCount: number | null;
    fcmSuccessCount: number | null;
    fcmFailureCount: number | null;
};
export type BroadcastAuditLogMinAggregateOutputType = {
    id: string | null;
    adminId: string | null;
    adminName: string | null;
    title: string | null;
    body: string | null;
    targetGroup: string | null;
    recipientsCount: number | null;
    fcmSuccessCount: number | null;
    fcmFailureCount: number | null;
    createdAt: Date | null;
};
export type BroadcastAuditLogMaxAggregateOutputType = {
    id: string | null;
    adminId: string | null;
    adminName: string | null;
    title: string | null;
    body: string | null;
    targetGroup: string | null;
    recipientsCount: number | null;
    fcmSuccessCount: number | null;
    fcmFailureCount: number | null;
    createdAt: Date | null;
};
export type BroadcastAuditLogCountAggregateOutputType = {
    id: number;
    adminId: number;
    adminName: number;
    title: number;
    body: number;
    targetGroup: number;
    recipientsCount: number;
    fcmSuccessCount: number;
    fcmFailureCount: number;
    createdAt: number;
    _all: number;
};
export type BroadcastAuditLogAvgAggregateInputType = {
    recipientsCount?: true;
    fcmSuccessCount?: true;
    fcmFailureCount?: true;
};
export type BroadcastAuditLogSumAggregateInputType = {
    recipientsCount?: true;
    fcmSuccessCount?: true;
    fcmFailureCount?: true;
};
export type BroadcastAuditLogMinAggregateInputType = {
    id?: true;
    adminId?: true;
    adminName?: true;
    title?: true;
    body?: true;
    targetGroup?: true;
    recipientsCount?: true;
    fcmSuccessCount?: true;
    fcmFailureCount?: true;
    createdAt?: true;
};
export type BroadcastAuditLogMaxAggregateInputType = {
    id?: true;
    adminId?: true;
    adminName?: true;
    title?: true;
    body?: true;
    targetGroup?: true;
    recipientsCount?: true;
    fcmSuccessCount?: true;
    fcmFailureCount?: true;
    createdAt?: true;
};
export type BroadcastAuditLogCountAggregateInputType = {
    id?: true;
    adminId?: true;
    adminName?: true;
    title?: true;
    body?: true;
    targetGroup?: true;
    recipientsCount?: true;
    fcmSuccessCount?: true;
    fcmFailureCount?: true;
    createdAt?: true;
    _all?: true;
};
export type BroadcastAuditLogAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BroadcastAuditLogWhereInput;
    orderBy?: Prisma.BroadcastAuditLogOrderByWithRelationInput | Prisma.BroadcastAuditLogOrderByWithRelationInput[];
    cursor?: Prisma.BroadcastAuditLogWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BroadcastAuditLogCountAggregateInputType;
    _avg?: BroadcastAuditLogAvgAggregateInputType;
    _sum?: BroadcastAuditLogSumAggregateInputType;
    _min?: BroadcastAuditLogMinAggregateInputType;
    _max?: BroadcastAuditLogMaxAggregateInputType;
};
export type GetBroadcastAuditLogAggregateType<T extends BroadcastAuditLogAggregateArgs> = {
    [P in keyof T & keyof AggregateBroadcastAuditLog]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBroadcastAuditLog[P]> : Prisma.GetScalarType<T[P], AggregateBroadcastAuditLog[P]>;
};
export type BroadcastAuditLogGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BroadcastAuditLogWhereInput;
    orderBy?: Prisma.BroadcastAuditLogOrderByWithAggregationInput | Prisma.BroadcastAuditLogOrderByWithAggregationInput[];
    by: Prisma.BroadcastAuditLogScalarFieldEnum[] | Prisma.BroadcastAuditLogScalarFieldEnum;
    having?: Prisma.BroadcastAuditLogScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BroadcastAuditLogCountAggregateInputType | true;
    _avg?: BroadcastAuditLogAvgAggregateInputType;
    _sum?: BroadcastAuditLogSumAggregateInputType;
    _min?: BroadcastAuditLogMinAggregateInputType;
    _max?: BroadcastAuditLogMaxAggregateInputType;
};
export type BroadcastAuditLogGroupByOutputType = {
    id: string;
    adminId: string;
    adminName: string | null;
    title: string;
    body: string;
    targetGroup: string;
    recipientsCount: number;
    fcmSuccessCount: number;
    fcmFailureCount: number;
    createdAt: Date;
    _count: BroadcastAuditLogCountAggregateOutputType | null;
    _avg: BroadcastAuditLogAvgAggregateOutputType | null;
    _sum: BroadcastAuditLogSumAggregateOutputType | null;
    _min: BroadcastAuditLogMinAggregateOutputType | null;
    _max: BroadcastAuditLogMaxAggregateOutputType | null;
};
export type GetBroadcastAuditLogGroupByPayload<T extends BroadcastAuditLogGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BroadcastAuditLogGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BroadcastAuditLogGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BroadcastAuditLogGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BroadcastAuditLogGroupByOutputType[P]>;
}>>;
export type BroadcastAuditLogWhereInput = {
    AND?: Prisma.BroadcastAuditLogWhereInput | Prisma.BroadcastAuditLogWhereInput[];
    OR?: Prisma.BroadcastAuditLogWhereInput[];
    NOT?: Prisma.BroadcastAuditLogWhereInput | Prisma.BroadcastAuditLogWhereInput[];
    id?: Prisma.StringFilter<"BroadcastAuditLog"> | string;
    adminId?: Prisma.StringFilter<"BroadcastAuditLog"> | string;
    adminName?: Prisma.StringNullableFilter<"BroadcastAuditLog"> | string | null;
    title?: Prisma.StringFilter<"BroadcastAuditLog"> | string;
    body?: Prisma.StringFilter<"BroadcastAuditLog"> | string;
    targetGroup?: Prisma.StringFilter<"BroadcastAuditLog"> | string;
    recipientsCount?: Prisma.IntFilter<"BroadcastAuditLog"> | number;
    fcmSuccessCount?: Prisma.IntFilter<"BroadcastAuditLog"> | number;
    fcmFailureCount?: Prisma.IntFilter<"BroadcastAuditLog"> | number;
    createdAt?: Prisma.DateTimeFilter<"BroadcastAuditLog"> | Date | string;
};
export type BroadcastAuditLogOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    adminId?: Prisma.SortOrder;
    adminName?: Prisma.SortOrderInput | Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    targetGroup?: Prisma.SortOrder;
    recipientsCount?: Prisma.SortOrder;
    fcmSuccessCount?: Prisma.SortOrder;
    fcmFailureCount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BroadcastAuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.BroadcastAuditLogWhereInput | Prisma.BroadcastAuditLogWhereInput[];
    OR?: Prisma.BroadcastAuditLogWhereInput[];
    NOT?: Prisma.BroadcastAuditLogWhereInput | Prisma.BroadcastAuditLogWhereInput[];
    adminId?: Prisma.StringFilter<"BroadcastAuditLog"> | string;
    adminName?: Prisma.StringNullableFilter<"BroadcastAuditLog"> | string | null;
    title?: Prisma.StringFilter<"BroadcastAuditLog"> | string;
    body?: Prisma.StringFilter<"BroadcastAuditLog"> | string;
    targetGroup?: Prisma.StringFilter<"BroadcastAuditLog"> | string;
    recipientsCount?: Prisma.IntFilter<"BroadcastAuditLog"> | number;
    fcmSuccessCount?: Prisma.IntFilter<"BroadcastAuditLog"> | number;
    fcmFailureCount?: Prisma.IntFilter<"BroadcastAuditLog"> | number;
    createdAt?: Prisma.DateTimeFilter<"BroadcastAuditLog"> | Date | string;
}, "id">;
export type BroadcastAuditLogOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    adminId?: Prisma.SortOrder;
    adminName?: Prisma.SortOrderInput | Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    targetGroup?: Prisma.SortOrder;
    recipientsCount?: Prisma.SortOrder;
    fcmSuccessCount?: Prisma.SortOrder;
    fcmFailureCount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.BroadcastAuditLogCountOrderByAggregateInput;
    _avg?: Prisma.BroadcastAuditLogAvgOrderByAggregateInput;
    _max?: Prisma.BroadcastAuditLogMaxOrderByAggregateInput;
    _min?: Prisma.BroadcastAuditLogMinOrderByAggregateInput;
    _sum?: Prisma.BroadcastAuditLogSumOrderByAggregateInput;
};
export type BroadcastAuditLogScalarWhereWithAggregatesInput = {
    AND?: Prisma.BroadcastAuditLogScalarWhereWithAggregatesInput | Prisma.BroadcastAuditLogScalarWhereWithAggregatesInput[];
    OR?: Prisma.BroadcastAuditLogScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BroadcastAuditLogScalarWhereWithAggregatesInput | Prisma.BroadcastAuditLogScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"BroadcastAuditLog"> | string;
    adminId?: Prisma.StringWithAggregatesFilter<"BroadcastAuditLog"> | string;
    adminName?: Prisma.StringNullableWithAggregatesFilter<"BroadcastAuditLog"> | string | null;
    title?: Prisma.StringWithAggregatesFilter<"BroadcastAuditLog"> | string;
    body?: Prisma.StringWithAggregatesFilter<"BroadcastAuditLog"> | string;
    targetGroup?: Prisma.StringWithAggregatesFilter<"BroadcastAuditLog"> | string;
    recipientsCount?: Prisma.IntWithAggregatesFilter<"BroadcastAuditLog"> | number;
    fcmSuccessCount?: Prisma.IntWithAggregatesFilter<"BroadcastAuditLog"> | number;
    fcmFailureCount?: Prisma.IntWithAggregatesFilter<"BroadcastAuditLog"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"BroadcastAuditLog"> | Date | string;
};
export type BroadcastAuditLogCreateInput = {
    id?: string;
    adminId: string;
    adminName?: string | null;
    title: string;
    body: string;
    targetGroup?: string;
    recipientsCount?: number;
    fcmSuccessCount?: number;
    fcmFailureCount?: number;
    createdAt?: Date | string;
};
export type BroadcastAuditLogUncheckedCreateInput = {
    id?: string;
    adminId: string;
    adminName?: string | null;
    title: string;
    body: string;
    targetGroup?: string;
    recipientsCount?: number;
    fcmSuccessCount?: number;
    fcmFailureCount?: number;
    createdAt?: Date | string;
};
export type BroadcastAuditLogUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    adminId?: Prisma.StringFieldUpdateOperationsInput | string;
    adminName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    targetGroup?: Prisma.StringFieldUpdateOperationsInput | string;
    recipientsCount?: Prisma.IntFieldUpdateOperationsInput | number;
    fcmSuccessCount?: Prisma.IntFieldUpdateOperationsInput | number;
    fcmFailureCount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BroadcastAuditLogUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    adminId?: Prisma.StringFieldUpdateOperationsInput | string;
    adminName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    targetGroup?: Prisma.StringFieldUpdateOperationsInput | string;
    recipientsCount?: Prisma.IntFieldUpdateOperationsInput | number;
    fcmSuccessCount?: Prisma.IntFieldUpdateOperationsInput | number;
    fcmFailureCount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BroadcastAuditLogCreateManyInput = {
    id?: string;
    adminId: string;
    adminName?: string | null;
    title: string;
    body: string;
    targetGroup?: string;
    recipientsCount?: number;
    fcmSuccessCount?: number;
    fcmFailureCount?: number;
    createdAt?: Date | string;
};
export type BroadcastAuditLogUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    adminId?: Prisma.StringFieldUpdateOperationsInput | string;
    adminName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    targetGroup?: Prisma.StringFieldUpdateOperationsInput | string;
    recipientsCount?: Prisma.IntFieldUpdateOperationsInput | number;
    fcmSuccessCount?: Prisma.IntFieldUpdateOperationsInput | number;
    fcmFailureCount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BroadcastAuditLogUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    adminId?: Prisma.StringFieldUpdateOperationsInput | string;
    adminName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    targetGroup?: Prisma.StringFieldUpdateOperationsInput | string;
    recipientsCount?: Prisma.IntFieldUpdateOperationsInput | number;
    fcmSuccessCount?: Prisma.IntFieldUpdateOperationsInput | number;
    fcmFailureCount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BroadcastAuditLogCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    adminId?: Prisma.SortOrder;
    adminName?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    targetGroup?: Prisma.SortOrder;
    recipientsCount?: Prisma.SortOrder;
    fcmSuccessCount?: Prisma.SortOrder;
    fcmFailureCount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BroadcastAuditLogAvgOrderByAggregateInput = {
    recipientsCount?: Prisma.SortOrder;
    fcmSuccessCount?: Prisma.SortOrder;
    fcmFailureCount?: Prisma.SortOrder;
};
export type BroadcastAuditLogMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    adminId?: Prisma.SortOrder;
    adminName?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    targetGroup?: Prisma.SortOrder;
    recipientsCount?: Prisma.SortOrder;
    fcmSuccessCount?: Prisma.SortOrder;
    fcmFailureCount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BroadcastAuditLogMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    adminId?: Prisma.SortOrder;
    adminName?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    targetGroup?: Prisma.SortOrder;
    recipientsCount?: Prisma.SortOrder;
    fcmSuccessCount?: Prisma.SortOrder;
    fcmFailureCount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BroadcastAuditLogSumOrderByAggregateInput = {
    recipientsCount?: Prisma.SortOrder;
    fcmSuccessCount?: Prisma.SortOrder;
    fcmFailureCount?: Prisma.SortOrder;
};
export type BroadcastAuditLogSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    adminId?: boolean;
    adminName?: boolean;
    title?: boolean;
    body?: boolean;
    targetGroup?: boolean;
    recipientsCount?: boolean;
    fcmSuccessCount?: boolean;
    fcmFailureCount?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["broadcastAuditLog"]>;
export type BroadcastAuditLogSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    adminId?: boolean;
    adminName?: boolean;
    title?: boolean;
    body?: boolean;
    targetGroup?: boolean;
    recipientsCount?: boolean;
    fcmSuccessCount?: boolean;
    fcmFailureCount?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["broadcastAuditLog"]>;
export type BroadcastAuditLogSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    adminId?: boolean;
    adminName?: boolean;
    title?: boolean;
    body?: boolean;
    targetGroup?: boolean;
    recipientsCount?: boolean;
    fcmSuccessCount?: boolean;
    fcmFailureCount?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["broadcastAuditLog"]>;
export type BroadcastAuditLogSelectScalar = {
    id?: boolean;
    adminId?: boolean;
    adminName?: boolean;
    title?: boolean;
    body?: boolean;
    targetGroup?: boolean;
    recipientsCount?: boolean;
    fcmSuccessCount?: boolean;
    fcmFailureCount?: boolean;
    createdAt?: boolean;
};
export type BroadcastAuditLogOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "adminId" | "adminName" | "title" | "body" | "targetGroup" | "recipientsCount" | "fcmSuccessCount" | "fcmFailureCount" | "createdAt", ExtArgs["result"]["broadcastAuditLog"]>;
export type $BroadcastAuditLogPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BroadcastAuditLog";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        adminId: string;
        adminName: string | null;
        title: string;
        body: string;
        targetGroup: string;
        recipientsCount: number;
        fcmSuccessCount: number;
        fcmFailureCount: number;
        createdAt: Date;
    }, ExtArgs["result"]["broadcastAuditLog"]>;
    composites: {};
};
export type BroadcastAuditLogGetPayload<S extends boolean | null | undefined | BroadcastAuditLogDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BroadcastAuditLogPayload, S>;
export type BroadcastAuditLogCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BroadcastAuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BroadcastAuditLogCountAggregateInputType | true;
};
export interface BroadcastAuditLogDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BroadcastAuditLog'];
        meta: {
            name: 'BroadcastAuditLog';
        };
    };
    findUnique<T extends BroadcastAuditLogFindUniqueArgs>(args: Prisma.SelectSubset<T, BroadcastAuditLogFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BroadcastAuditLogClient<runtime.Types.Result.GetResult<Prisma.$BroadcastAuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BroadcastAuditLogFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BroadcastAuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BroadcastAuditLogClient<runtime.Types.Result.GetResult<Prisma.$BroadcastAuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BroadcastAuditLogFindFirstArgs>(args?: Prisma.SelectSubset<T, BroadcastAuditLogFindFirstArgs<ExtArgs>>): Prisma.Prisma__BroadcastAuditLogClient<runtime.Types.Result.GetResult<Prisma.$BroadcastAuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BroadcastAuditLogFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BroadcastAuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BroadcastAuditLogClient<runtime.Types.Result.GetResult<Prisma.$BroadcastAuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BroadcastAuditLogFindManyArgs>(args?: Prisma.SelectSubset<T, BroadcastAuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BroadcastAuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BroadcastAuditLogCreateArgs>(args: Prisma.SelectSubset<T, BroadcastAuditLogCreateArgs<ExtArgs>>): Prisma.Prisma__BroadcastAuditLogClient<runtime.Types.Result.GetResult<Prisma.$BroadcastAuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BroadcastAuditLogCreateManyArgs>(args?: Prisma.SelectSubset<T, BroadcastAuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BroadcastAuditLogCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BroadcastAuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BroadcastAuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BroadcastAuditLogDeleteArgs>(args: Prisma.SelectSubset<T, BroadcastAuditLogDeleteArgs<ExtArgs>>): Prisma.Prisma__BroadcastAuditLogClient<runtime.Types.Result.GetResult<Prisma.$BroadcastAuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BroadcastAuditLogUpdateArgs>(args: Prisma.SelectSubset<T, BroadcastAuditLogUpdateArgs<ExtArgs>>): Prisma.Prisma__BroadcastAuditLogClient<runtime.Types.Result.GetResult<Prisma.$BroadcastAuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BroadcastAuditLogDeleteManyArgs>(args?: Prisma.SelectSubset<T, BroadcastAuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BroadcastAuditLogUpdateManyArgs>(args: Prisma.SelectSubset<T, BroadcastAuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BroadcastAuditLogUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BroadcastAuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BroadcastAuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BroadcastAuditLogUpsertArgs>(args: Prisma.SelectSubset<T, BroadcastAuditLogUpsertArgs<ExtArgs>>): Prisma.Prisma__BroadcastAuditLogClient<runtime.Types.Result.GetResult<Prisma.$BroadcastAuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BroadcastAuditLogCountArgs>(args?: Prisma.Subset<T, BroadcastAuditLogCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BroadcastAuditLogCountAggregateOutputType> : number>;
    aggregate<T extends BroadcastAuditLogAggregateArgs>(args: Prisma.Subset<T, BroadcastAuditLogAggregateArgs>): Prisma.PrismaPromise<GetBroadcastAuditLogAggregateType<T>>;
    groupBy<T extends BroadcastAuditLogGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BroadcastAuditLogGroupByArgs['orderBy'];
    } : {
        orderBy?: BroadcastAuditLogGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BroadcastAuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBroadcastAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BroadcastAuditLogFieldRefs;
}
export interface Prisma__BroadcastAuditLogClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BroadcastAuditLogFieldRefs {
    readonly id: Prisma.FieldRef<"BroadcastAuditLog", 'String'>;
    readonly adminId: Prisma.FieldRef<"BroadcastAuditLog", 'String'>;
    readonly adminName: Prisma.FieldRef<"BroadcastAuditLog", 'String'>;
    readonly title: Prisma.FieldRef<"BroadcastAuditLog", 'String'>;
    readonly body: Prisma.FieldRef<"BroadcastAuditLog", 'String'>;
    readonly targetGroup: Prisma.FieldRef<"BroadcastAuditLog", 'String'>;
    readonly recipientsCount: Prisma.FieldRef<"BroadcastAuditLog", 'Int'>;
    readonly fcmSuccessCount: Prisma.FieldRef<"BroadcastAuditLog", 'Int'>;
    readonly fcmFailureCount: Prisma.FieldRef<"BroadcastAuditLog", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"BroadcastAuditLog", 'DateTime'>;
}
export type BroadcastAuditLogFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BroadcastAuditLogSelect<ExtArgs> | null;
    omit?: Prisma.BroadcastAuditLogOmit<ExtArgs> | null;
    where: Prisma.BroadcastAuditLogWhereUniqueInput;
};
export type BroadcastAuditLogFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BroadcastAuditLogSelect<ExtArgs> | null;
    omit?: Prisma.BroadcastAuditLogOmit<ExtArgs> | null;
    where: Prisma.BroadcastAuditLogWhereUniqueInput;
};
export type BroadcastAuditLogFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BroadcastAuditLogSelect<ExtArgs> | null;
    omit?: Prisma.BroadcastAuditLogOmit<ExtArgs> | null;
    where?: Prisma.BroadcastAuditLogWhereInput;
    orderBy?: Prisma.BroadcastAuditLogOrderByWithRelationInput | Prisma.BroadcastAuditLogOrderByWithRelationInput[];
    cursor?: Prisma.BroadcastAuditLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BroadcastAuditLogScalarFieldEnum | Prisma.BroadcastAuditLogScalarFieldEnum[];
};
export type BroadcastAuditLogFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BroadcastAuditLogSelect<ExtArgs> | null;
    omit?: Prisma.BroadcastAuditLogOmit<ExtArgs> | null;
    where?: Prisma.BroadcastAuditLogWhereInput;
    orderBy?: Prisma.BroadcastAuditLogOrderByWithRelationInput | Prisma.BroadcastAuditLogOrderByWithRelationInput[];
    cursor?: Prisma.BroadcastAuditLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BroadcastAuditLogScalarFieldEnum | Prisma.BroadcastAuditLogScalarFieldEnum[];
};
export type BroadcastAuditLogFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BroadcastAuditLogSelect<ExtArgs> | null;
    omit?: Prisma.BroadcastAuditLogOmit<ExtArgs> | null;
    where?: Prisma.BroadcastAuditLogWhereInput;
    orderBy?: Prisma.BroadcastAuditLogOrderByWithRelationInput | Prisma.BroadcastAuditLogOrderByWithRelationInput[];
    cursor?: Prisma.BroadcastAuditLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BroadcastAuditLogScalarFieldEnum | Prisma.BroadcastAuditLogScalarFieldEnum[];
};
export type BroadcastAuditLogCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BroadcastAuditLogSelect<ExtArgs> | null;
    omit?: Prisma.BroadcastAuditLogOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BroadcastAuditLogCreateInput, Prisma.BroadcastAuditLogUncheckedCreateInput>;
};
export type BroadcastAuditLogCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BroadcastAuditLogCreateManyInput | Prisma.BroadcastAuditLogCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BroadcastAuditLogCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BroadcastAuditLogSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BroadcastAuditLogOmit<ExtArgs> | null;
    data: Prisma.BroadcastAuditLogCreateManyInput | Prisma.BroadcastAuditLogCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BroadcastAuditLogUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BroadcastAuditLogSelect<ExtArgs> | null;
    omit?: Prisma.BroadcastAuditLogOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BroadcastAuditLogUpdateInput, Prisma.BroadcastAuditLogUncheckedUpdateInput>;
    where: Prisma.BroadcastAuditLogWhereUniqueInput;
};
export type BroadcastAuditLogUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BroadcastAuditLogUpdateManyMutationInput, Prisma.BroadcastAuditLogUncheckedUpdateManyInput>;
    where?: Prisma.BroadcastAuditLogWhereInput;
    limit?: number;
};
export type BroadcastAuditLogUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BroadcastAuditLogSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BroadcastAuditLogOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BroadcastAuditLogUpdateManyMutationInput, Prisma.BroadcastAuditLogUncheckedUpdateManyInput>;
    where?: Prisma.BroadcastAuditLogWhereInput;
    limit?: number;
};
export type BroadcastAuditLogUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BroadcastAuditLogSelect<ExtArgs> | null;
    omit?: Prisma.BroadcastAuditLogOmit<ExtArgs> | null;
    where: Prisma.BroadcastAuditLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.BroadcastAuditLogCreateInput, Prisma.BroadcastAuditLogUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BroadcastAuditLogUpdateInput, Prisma.BroadcastAuditLogUncheckedUpdateInput>;
};
export type BroadcastAuditLogDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BroadcastAuditLogSelect<ExtArgs> | null;
    omit?: Prisma.BroadcastAuditLogOmit<ExtArgs> | null;
    where: Prisma.BroadcastAuditLogWhereUniqueInput;
};
export type BroadcastAuditLogDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BroadcastAuditLogWhereInput;
    limit?: number;
};
export type BroadcastAuditLogDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BroadcastAuditLogSelect<ExtArgs> | null;
    omit?: Prisma.BroadcastAuditLogOmit<ExtArgs> | null;
};
