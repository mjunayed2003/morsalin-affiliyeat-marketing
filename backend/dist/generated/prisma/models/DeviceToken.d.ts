import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type DeviceTokenModel = runtime.Types.Result.DefaultSelection<Prisma.$DeviceTokenPayload>;
export type AggregateDeviceToken = {
    _count: DeviceTokenCountAggregateOutputType | null;
    _min: DeviceTokenMinAggregateOutputType | null;
    _max: DeviceTokenMaxAggregateOutputType | null;
};
export type DeviceTokenMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    token: string | null;
    platform: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DeviceTokenMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    token: string | null;
    platform: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DeviceTokenCountAggregateOutputType = {
    id: number;
    userId: number;
    token: number;
    platform: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type DeviceTokenMinAggregateInputType = {
    id?: true;
    userId?: true;
    token?: true;
    platform?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DeviceTokenMaxAggregateInputType = {
    id?: true;
    userId?: true;
    token?: true;
    platform?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DeviceTokenCountAggregateInputType = {
    id?: true;
    userId?: true;
    token?: true;
    platform?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type DeviceTokenAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DeviceTokenWhereInput;
    orderBy?: Prisma.DeviceTokenOrderByWithRelationInput | Prisma.DeviceTokenOrderByWithRelationInput[];
    cursor?: Prisma.DeviceTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DeviceTokenCountAggregateInputType;
    _min?: DeviceTokenMinAggregateInputType;
    _max?: DeviceTokenMaxAggregateInputType;
};
export type GetDeviceTokenAggregateType<T extends DeviceTokenAggregateArgs> = {
    [P in keyof T & keyof AggregateDeviceToken]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDeviceToken[P]> : Prisma.GetScalarType<T[P], AggregateDeviceToken[P]>;
};
export type DeviceTokenGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DeviceTokenWhereInput;
    orderBy?: Prisma.DeviceTokenOrderByWithAggregationInput | Prisma.DeviceTokenOrderByWithAggregationInput[];
    by: Prisma.DeviceTokenScalarFieldEnum[] | Prisma.DeviceTokenScalarFieldEnum;
    having?: Prisma.DeviceTokenScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DeviceTokenCountAggregateInputType | true;
    _min?: DeviceTokenMinAggregateInputType;
    _max?: DeviceTokenMaxAggregateInputType;
};
export type DeviceTokenGroupByOutputType = {
    id: string;
    userId: string;
    token: string;
    platform: string;
    createdAt: Date;
    updatedAt: Date;
    _count: DeviceTokenCountAggregateOutputType | null;
    _min: DeviceTokenMinAggregateOutputType | null;
    _max: DeviceTokenMaxAggregateOutputType | null;
};
export type GetDeviceTokenGroupByPayload<T extends DeviceTokenGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DeviceTokenGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DeviceTokenGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DeviceTokenGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DeviceTokenGroupByOutputType[P]>;
}>>;
export type DeviceTokenWhereInput = {
    AND?: Prisma.DeviceTokenWhereInput | Prisma.DeviceTokenWhereInput[];
    OR?: Prisma.DeviceTokenWhereInput[];
    NOT?: Prisma.DeviceTokenWhereInput | Prisma.DeviceTokenWhereInput[];
    id?: Prisma.StringFilter<"DeviceToken"> | string;
    userId?: Prisma.StringFilter<"DeviceToken"> | string;
    token?: Prisma.StringFilter<"DeviceToken"> | string;
    platform?: Prisma.StringFilter<"DeviceToken"> | string;
    createdAt?: Prisma.DateTimeFilter<"DeviceToken"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"DeviceToken"> | Date | string;
};
export type DeviceTokenOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DeviceTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    token?: string;
    AND?: Prisma.DeviceTokenWhereInput | Prisma.DeviceTokenWhereInput[];
    OR?: Prisma.DeviceTokenWhereInput[];
    NOT?: Prisma.DeviceTokenWhereInput | Prisma.DeviceTokenWhereInput[];
    userId?: Prisma.StringFilter<"DeviceToken"> | string;
    platform?: Prisma.StringFilter<"DeviceToken"> | string;
    createdAt?: Prisma.DateTimeFilter<"DeviceToken"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"DeviceToken"> | Date | string;
}, "id" | "token">;
export type DeviceTokenOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.DeviceTokenCountOrderByAggregateInput;
    _max?: Prisma.DeviceTokenMaxOrderByAggregateInput;
    _min?: Prisma.DeviceTokenMinOrderByAggregateInput;
};
export type DeviceTokenScalarWhereWithAggregatesInput = {
    AND?: Prisma.DeviceTokenScalarWhereWithAggregatesInput | Prisma.DeviceTokenScalarWhereWithAggregatesInput[];
    OR?: Prisma.DeviceTokenScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DeviceTokenScalarWhereWithAggregatesInput | Prisma.DeviceTokenScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"DeviceToken"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"DeviceToken"> | string;
    token?: Prisma.StringWithAggregatesFilter<"DeviceToken"> | string;
    platform?: Prisma.StringWithAggregatesFilter<"DeviceToken"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"DeviceToken"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"DeviceToken"> | Date | string;
};
export type DeviceTokenCreateInput = {
    id?: string;
    userId: string;
    token: string;
    platform?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DeviceTokenUncheckedCreateInput = {
    id?: string;
    userId: string;
    token: string;
    platform?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DeviceTokenUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DeviceTokenUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DeviceTokenCreateManyInput = {
    id?: string;
    userId: string;
    token: string;
    platform?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DeviceTokenUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DeviceTokenUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DeviceTokenCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DeviceTokenMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DeviceTokenMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DeviceTokenSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    token?: boolean;
    platform?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["deviceToken"]>;
export type DeviceTokenSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    token?: boolean;
    platform?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["deviceToken"]>;
export type DeviceTokenSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    token?: boolean;
    platform?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["deviceToken"]>;
export type DeviceTokenSelectScalar = {
    id?: boolean;
    userId?: boolean;
    token?: boolean;
    platform?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type DeviceTokenOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "token" | "platform" | "createdAt" | "updatedAt", ExtArgs["result"]["deviceToken"]>;
export type $DeviceTokenPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "DeviceToken";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        token: string;
        platform: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["deviceToken"]>;
    composites: {};
};
export type DeviceTokenGetPayload<S extends boolean | null | undefined | DeviceTokenDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DeviceTokenPayload, S>;
export type DeviceTokenCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DeviceTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DeviceTokenCountAggregateInputType | true;
};
export interface DeviceTokenDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['DeviceToken'];
        meta: {
            name: 'DeviceToken';
        };
    };
    findUnique<T extends DeviceTokenFindUniqueArgs>(args: Prisma.SelectSubset<T, DeviceTokenFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DeviceTokenClient<runtime.Types.Result.GetResult<Prisma.$DeviceTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DeviceTokenFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DeviceTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DeviceTokenClient<runtime.Types.Result.GetResult<Prisma.$DeviceTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DeviceTokenFindFirstArgs>(args?: Prisma.SelectSubset<T, DeviceTokenFindFirstArgs<ExtArgs>>): Prisma.Prisma__DeviceTokenClient<runtime.Types.Result.GetResult<Prisma.$DeviceTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DeviceTokenFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DeviceTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DeviceTokenClient<runtime.Types.Result.GetResult<Prisma.$DeviceTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DeviceTokenFindManyArgs>(args?: Prisma.SelectSubset<T, DeviceTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DeviceTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DeviceTokenCreateArgs>(args: Prisma.SelectSubset<T, DeviceTokenCreateArgs<ExtArgs>>): Prisma.Prisma__DeviceTokenClient<runtime.Types.Result.GetResult<Prisma.$DeviceTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DeviceTokenCreateManyArgs>(args?: Prisma.SelectSubset<T, DeviceTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DeviceTokenCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DeviceTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DeviceTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DeviceTokenDeleteArgs>(args: Prisma.SelectSubset<T, DeviceTokenDeleteArgs<ExtArgs>>): Prisma.Prisma__DeviceTokenClient<runtime.Types.Result.GetResult<Prisma.$DeviceTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DeviceTokenUpdateArgs>(args: Prisma.SelectSubset<T, DeviceTokenUpdateArgs<ExtArgs>>): Prisma.Prisma__DeviceTokenClient<runtime.Types.Result.GetResult<Prisma.$DeviceTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DeviceTokenDeleteManyArgs>(args?: Prisma.SelectSubset<T, DeviceTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DeviceTokenUpdateManyArgs>(args: Prisma.SelectSubset<T, DeviceTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DeviceTokenUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DeviceTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DeviceTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DeviceTokenUpsertArgs>(args: Prisma.SelectSubset<T, DeviceTokenUpsertArgs<ExtArgs>>): Prisma.Prisma__DeviceTokenClient<runtime.Types.Result.GetResult<Prisma.$DeviceTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DeviceTokenCountArgs>(args?: Prisma.Subset<T, DeviceTokenCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DeviceTokenCountAggregateOutputType> : number>;
    aggregate<T extends DeviceTokenAggregateArgs>(args: Prisma.Subset<T, DeviceTokenAggregateArgs>): Prisma.PrismaPromise<GetDeviceTokenAggregateType<T>>;
    groupBy<T extends DeviceTokenGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DeviceTokenGroupByArgs['orderBy'];
    } : {
        orderBy?: DeviceTokenGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DeviceTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeviceTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DeviceTokenFieldRefs;
}
export interface Prisma__DeviceTokenClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DeviceTokenFieldRefs {
    readonly id: Prisma.FieldRef<"DeviceToken", 'String'>;
    readonly userId: Prisma.FieldRef<"DeviceToken", 'String'>;
    readonly token: Prisma.FieldRef<"DeviceToken", 'String'>;
    readonly platform: Prisma.FieldRef<"DeviceToken", 'String'>;
    readonly createdAt: Prisma.FieldRef<"DeviceToken", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"DeviceToken", 'DateTime'>;
}
export type DeviceTokenFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeviceTokenSelect<ExtArgs> | null;
    omit?: Prisma.DeviceTokenOmit<ExtArgs> | null;
    where: Prisma.DeviceTokenWhereUniqueInput;
};
export type DeviceTokenFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeviceTokenSelect<ExtArgs> | null;
    omit?: Prisma.DeviceTokenOmit<ExtArgs> | null;
    where: Prisma.DeviceTokenWhereUniqueInput;
};
export type DeviceTokenFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeviceTokenSelect<ExtArgs> | null;
    omit?: Prisma.DeviceTokenOmit<ExtArgs> | null;
    where?: Prisma.DeviceTokenWhereInput;
    orderBy?: Prisma.DeviceTokenOrderByWithRelationInput | Prisma.DeviceTokenOrderByWithRelationInput[];
    cursor?: Prisma.DeviceTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DeviceTokenScalarFieldEnum | Prisma.DeviceTokenScalarFieldEnum[];
};
export type DeviceTokenFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeviceTokenSelect<ExtArgs> | null;
    omit?: Prisma.DeviceTokenOmit<ExtArgs> | null;
    where?: Prisma.DeviceTokenWhereInput;
    orderBy?: Prisma.DeviceTokenOrderByWithRelationInput | Prisma.DeviceTokenOrderByWithRelationInput[];
    cursor?: Prisma.DeviceTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DeviceTokenScalarFieldEnum | Prisma.DeviceTokenScalarFieldEnum[];
};
export type DeviceTokenFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeviceTokenSelect<ExtArgs> | null;
    omit?: Prisma.DeviceTokenOmit<ExtArgs> | null;
    where?: Prisma.DeviceTokenWhereInput;
    orderBy?: Prisma.DeviceTokenOrderByWithRelationInput | Prisma.DeviceTokenOrderByWithRelationInput[];
    cursor?: Prisma.DeviceTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DeviceTokenScalarFieldEnum | Prisma.DeviceTokenScalarFieldEnum[];
};
export type DeviceTokenCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeviceTokenSelect<ExtArgs> | null;
    omit?: Prisma.DeviceTokenOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DeviceTokenCreateInput, Prisma.DeviceTokenUncheckedCreateInput>;
};
export type DeviceTokenCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DeviceTokenCreateManyInput | Prisma.DeviceTokenCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DeviceTokenCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeviceTokenSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DeviceTokenOmit<ExtArgs> | null;
    data: Prisma.DeviceTokenCreateManyInput | Prisma.DeviceTokenCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DeviceTokenUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeviceTokenSelect<ExtArgs> | null;
    omit?: Prisma.DeviceTokenOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DeviceTokenUpdateInput, Prisma.DeviceTokenUncheckedUpdateInput>;
    where: Prisma.DeviceTokenWhereUniqueInput;
};
export type DeviceTokenUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DeviceTokenUpdateManyMutationInput, Prisma.DeviceTokenUncheckedUpdateManyInput>;
    where?: Prisma.DeviceTokenWhereInput;
    limit?: number;
};
export type DeviceTokenUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeviceTokenSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DeviceTokenOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DeviceTokenUpdateManyMutationInput, Prisma.DeviceTokenUncheckedUpdateManyInput>;
    where?: Prisma.DeviceTokenWhereInput;
    limit?: number;
};
export type DeviceTokenUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeviceTokenSelect<ExtArgs> | null;
    omit?: Prisma.DeviceTokenOmit<ExtArgs> | null;
    where: Prisma.DeviceTokenWhereUniqueInput;
    create: Prisma.XOR<Prisma.DeviceTokenCreateInput, Prisma.DeviceTokenUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DeviceTokenUpdateInput, Prisma.DeviceTokenUncheckedUpdateInput>;
};
export type DeviceTokenDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeviceTokenSelect<ExtArgs> | null;
    omit?: Prisma.DeviceTokenOmit<ExtArgs> | null;
    where: Prisma.DeviceTokenWhereUniqueInput;
};
export type DeviceTokenDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DeviceTokenWhereInput;
    limit?: number;
};
export type DeviceTokenDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeviceTokenSelect<ExtArgs> | null;
    omit?: Prisma.DeviceTokenOmit<ExtArgs> | null;
};
