import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type UserNotificationReadModel = runtime.Types.Result.DefaultSelection<Prisma.$UserNotificationReadPayload>;
export type AggregateUserNotificationRead = {
    _count: UserNotificationReadCountAggregateOutputType | null;
    _min: UserNotificationReadMinAggregateOutputType | null;
    _max: UserNotificationReadMaxAggregateOutputType | null;
};
export type UserNotificationReadMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    notificationId: string | null;
    readAt: Date | null;
};
export type UserNotificationReadMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    notificationId: string | null;
    readAt: Date | null;
};
export type UserNotificationReadCountAggregateOutputType = {
    id: number;
    userId: number;
    notificationId: number;
    readAt: number;
    _all: number;
};
export type UserNotificationReadMinAggregateInputType = {
    id?: true;
    userId?: true;
    notificationId?: true;
    readAt?: true;
};
export type UserNotificationReadMaxAggregateInputType = {
    id?: true;
    userId?: true;
    notificationId?: true;
    readAt?: true;
};
export type UserNotificationReadCountAggregateInputType = {
    id?: true;
    userId?: true;
    notificationId?: true;
    readAt?: true;
    _all?: true;
};
export type UserNotificationReadAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserNotificationReadWhereInput;
    orderBy?: Prisma.UserNotificationReadOrderByWithRelationInput | Prisma.UserNotificationReadOrderByWithRelationInput[];
    cursor?: Prisma.UserNotificationReadWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserNotificationReadCountAggregateInputType;
    _min?: UserNotificationReadMinAggregateInputType;
    _max?: UserNotificationReadMaxAggregateInputType;
};
export type GetUserNotificationReadAggregateType<T extends UserNotificationReadAggregateArgs> = {
    [P in keyof T & keyof AggregateUserNotificationRead]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUserNotificationRead[P]> : Prisma.GetScalarType<T[P], AggregateUserNotificationRead[P]>;
};
export type UserNotificationReadGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserNotificationReadWhereInput;
    orderBy?: Prisma.UserNotificationReadOrderByWithAggregationInput | Prisma.UserNotificationReadOrderByWithAggregationInput[];
    by: Prisma.UserNotificationReadScalarFieldEnum[] | Prisma.UserNotificationReadScalarFieldEnum;
    having?: Prisma.UserNotificationReadScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserNotificationReadCountAggregateInputType | true;
    _min?: UserNotificationReadMinAggregateInputType;
    _max?: UserNotificationReadMaxAggregateInputType;
};
export type UserNotificationReadGroupByOutputType = {
    id: string;
    userId: string;
    notificationId: string;
    readAt: Date;
    _count: UserNotificationReadCountAggregateOutputType | null;
    _min: UserNotificationReadMinAggregateOutputType | null;
    _max: UserNotificationReadMaxAggregateOutputType | null;
};
export type GetUserNotificationReadGroupByPayload<T extends UserNotificationReadGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserNotificationReadGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserNotificationReadGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserNotificationReadGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserNotificationReadGroupByOutputType[P]>;
}>>;
export type UserNotificationReadWhereInput = {
    AND?: Prisma.UserNotificationReadWhereInput | Prisma.UserNotificationReadWhereInput[];
    OR?: Prisma.UserNotificationReadWhereInput[];
    NOT?: Prisma.UserNotificationReadWhereInput | Prisma.UserNotificationReadWhereInput[];
    id?: Prisma.StringFilter<"UserNotificationRead"> | string;
    userId?: Prisma.StringFilter<"UserNotificationRead"> | string;
    notificationId?: Prisma.StringFilter<"UserNotificationRead"> | string;
    readAt?: Prisma.DateTimeFilter<"UserNotificationRead"> | Date | string;
};
export type UserNotificationReadOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    notificationId?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
};
export type UserNotificationReadWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_notificationId?: Prisma.UserNotificationReadUserIdNotificationIdCompoundUniqueInput;
    AND?: Prisma.UserNotificationReadWhereInput | Prisma.UserNotificationReadWhereInput[];
    OR?: Prisma.UserNotificationReadWhereInput[];
    NOT?: Prisma.UserNotificationReadWhereInput | Prisma.UserNotificationReadWhereInput[];
    userId?: Prisma.StringFilter<"UserNotificationRead"> | string;
    notificationId?: Prisma.StringFilter<"UserNotificationRead"> | string;
    readAt?: Prisma.DateTimeFilter<"UserNotificationRead"> | Date | string;
}, "id" | "userId_notificationId">;
export type UserNotificationReadOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    notificationId?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
    _count?: Prisma.UserNotificationReadCountOrderByAggregateInput;
    _max?: Prisma.UserNotificationReadMaxOrderByAggregateInput;
    _min?: Prisma.UserNotificationReadMinOrderByAggregateInput;
};
export type UserNotificationReadScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserNotificationReadScalarWhereWithAggregatesInput | Prisma.UserNotificationReadScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserNotificationReadScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserNotificationReadScalarWhereWithAggregatesInput | Prisma.UserNotificationReadScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"UserNotificationRead"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"UserNotificationRead"> | string;
    notificationId?: Prisma.StringWithAggregatesFilter<"UserNotificationRead"> | string;
    readAt?: Prisma.DateTimeWithAggregatesFilter<"UserNotificationRead"> | Date | string;
};
export type UserNotificationReadCreateInput = {
    id?: string;
    userId: string;
    notificationId: string;
    readAt?: Date | string;
};
export type UserNotificationReadUncheckedCreateInput = {
    id?: string;
    userId: string;
    notificationId: string;
    readAt?: Date | string;
};
export type UserNotificationReadUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    notificationId?: Prisma.StringFieldUpdateOperationsInput | string;
    readAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserNotificationReadUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    notificationId?: Prisma.StringFieldUpdateOperationsInput | string;
    readAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserNotificationReadCreateManyInput = {
    id?: string;
    userId: string;
    notificationId: string;
    readAt?: Date | string;
};
export type UserNotificationReadUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    notificationId?: Prisma.StringFieldUpdateOperationsInput | string;
    readAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserNotificationReadUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    notificationId?: Prisma.StringFieldUpdateOperationsInput | string;
    readAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserNotificationReadUserIdNotificationIdCompoundUniqueInput = {
    userId: string;
    notificationId: string;
};
export type UserNotificationReadCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    notificationId?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
};
export type UserNotificationReadMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    notificationId?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
};
export type UserNotificationReadMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    notificationId?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
};
export type UserNotificationReadSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    notificationId?: boolean;
    readAt?: boolean;
}, ExtArgs["result"]["userNotificationRead"]>;
export type UserNotificationReadSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    notificationId?: boolean;
    readAt?: boolean;
}, ExtArgs["result"]["userNotificationRead"]>;
export type UserNotificationReadSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    notificationId?: boolean;
    readAt?: boolean;
}, ExtArgs["result"]["userNotificationRead"]>;
export type UserNotificationReadSelectScalar = {
    id?: boolean;
    userId?: boolean;
    notificationId?: boolean;
    readAt?: boolean;
};
export type UserNotificationReadOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "notificationId" | "readAt", ExtArgs["result"]["userNotificationRead"]>;
export type $UserNotificationReadPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserNotificationRead";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        notificationId: string;
        readAt: Date;
    }, ExtArgs["result"]["userNotificationRead"]>;
    composites: {};
};
export type UserNotificationReadGetPayload<S extends boolean | null | undefined | UserNotificationReadDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserNotificationReadPayload, S>;
export type UserNotificationReadCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserNotificationReadFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserNotificationReadCountAggregateInputType | true;
};
export interface UserNotificationReadDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UserNotificationRead'];
        meta: {
            name: 'UserNotificationRead';
        };
    };
    findUnique<T extends UserNotificationReadFindUniqueArgs>(args: Prisma.SelectSubset<T, UserNotificationReadFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserNotificationReadClient<runtime.Types.Result.GetResult<Prisma.$UserNotificationReadPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserNotificationReadFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserNotificationReadFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserNotificationReadClient<runtime.Types.Result.GetResult<Prisma.$UserNotificationReadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserNotificationReadFindFirstArgs>(args?: Prisma.SelectSubset<T, UserNotificationReadFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserNotificationReadClient<runtime.Types.Result.GetResult<Prisma.$UserNotificationReadPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserNotificationReadFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserNotificationReadFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserNotificationReadClient<runtime.Types.Result.GetResult<Prisma.$UserNotificationReadPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserNotificationReadFindManyArgs>(args?: Prisma.SelectSubset<T, UserNotificationReadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserNotificationReadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserNotificationReadCreateArgs>(args: Prisma.SelectSubset<T, UserNotificationReadCreateArgs<ExtArgs>>): Prisma.Prisma__UserNotificationReadClient<runtime.Types.Result.GetResult<Prisma.$UserNotificationReadPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserNotificationReadCreateManyArgs>(args?: Prisma.SelectSubset<T, UserNotificationReadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserNotificationReadCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserNotificationReadCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserNotificationReadPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserNotificationReadDeleteArgs>(args: Prisma.SelectSubset<T, UserNotificationReadDeleteArgs<ExtArgs>>): Prisma.Prisma__UserNotificationReadClient<runtime.Types.Result.GetResult<Prisma.$UserNotificationReadPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserNotificationReadUpdateArgs>(args: Prisma.SelectSubset<T, UserNotificationReadUpdateArgs<ExtArgs>>): Prisma.Prisma__UserNotificationReadClient<runtime.Types.Result.GetResult<Prisma.$UserNotificationReadPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserNotificationReadDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserNotificationReadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserNotificationReadUpdateManyArgs>(args: Prisma.SelectSubset<T, UserNotificationReadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserNotificationReadUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserNotificationReadUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserNotificationReadPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserNotificationReadUpsertArgs>(args: Prisma.SelectSubset<T, UserNotificationReadUpsertArgs<ExtArgs>>): Prisma.Prisma__UserNotificationReadClient<runtime.Types.Result.GetResult<Prisma.$UserNotificationReadPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserNotificationReadCountArgs>(args?: Prisma.Subset<T, UserNotificationReadCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserNotificationReadCountAggregateOutputType> : number>;
    aggregate<T extends UserNotificationReadAggregateArgs>(args: Prisma.Subset<T, UserNotificationReadAggregateArgs>): Prisma.PrismaPromise<GetUserNotificationReadAggregateType<T>>;
    groupBy<T extends UserNotificationReadGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserNotificationReadGroupByArgs['orderBy'];
    } : {
        orderBy?: UserNotificationReadGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserNotificationReadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserNotificationReadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserNotificationReadFieldRefs;
}
export interface Prisma__UserNotificationReadClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserNotificationReadFieldRefs {
    readonly id: Prisma.FieldRef<"UserNotificationRead", 'String'>;
    readonly userId: Prisma.FieldRef<"UserNotificationRead", 'String'>;
    readonly notificationId: Prisma.FieldRef<"UserNotificationRead", 'String'>;
    readonly readAt: Prisma.FieldRef<"UserNotificationRead", 'DateTime'>;
}
export type UserNotificationReadFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationReadSelect<ExtArgs> | null;
    omit?: Prisma.UserNotificationReadOmit<ExtArgs> | null;
    where: Prisma.UserNotificationReadWhereUniqueInput;
};
export type UserNotificationReadFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationReadSelect<ExtArgs> | null;
    omit?: Prisma.UserNotificationReadOmit<ExtArgs> | null;
    where: Prisma.UserNotificationReadWhereUniqueInput;
};
export type UserNotificationReadFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationReadSelect<ExtArgs> | null;
    omit?: Prisma.UserNotificationReadOmit<ExtArgs> | null;
    where?: Prisma.UserNotificationReadWhereInput;
    orderBy?: Prisma.UserNotificationReadOrderByWithRelationInput | Prisma.UserNotificationReadOrderByWithRelationInput[];
    cursor?: Prisma.UserNotificationReadWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserNotificationReadScalarFieldEnum | Prisma.UserNotificationReadScalarFieldEnum[];
};
export type UserNotificationReadFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationReadSelect<ExtArgs> | null;
    omit?: Prisma.UserNotificationReadOmit<ExtArgs> | null;
    where?: Prisma.UserNotificationReadWhereInput;
    orderBy?: Prisma.UserNotificationReadOrderByWithRelationInput | Prisma.UserNotificationReadOrderByWithRelationInput[];
    cursor?: Prisma.UserNotificationReadWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserNotificationReadScalarFieldEnum | Prisma.UserNotificationReadScalarFieldEnum[];
};
export type UserNotificationReadFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationReadSelect<ExtArgs> | null;
    omit?: Prisma.UserNotificationReadOmit<ExtArgs> | null;
    where?: Prisma.UserNotificationReadWhereInput;
    orderBy?: Prisma.UserNotificationReadOrderByWithRelationInput | Prisma.UserNotificationReadOrderByWithRelationInput[];
    cursor?: Prisma.UserNotificationReadWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserNotificationReadScalarFieldEnum | Prisma.UserNotificationReadScalarFieldEnum[];
};
export type UserNotificationReadCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationReadSelect<ExtArgs> | null;
    omit?: Prisma.UserNotificationReadOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserNotificationReadCreateInput, Prisma.UserNotificationReadUncheckedCreateInput>;
};
export type UserNotificationReadCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserNotificationReadCreateManyInput | Prisma.UserNotificationReadCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserNotificationReadCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationReadSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserNotificationReadOmit<ExtArgs> | null;
    data: Prisma.UserNotificationReadCreateManyInput | Prisma.UserNotificationReadCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserNotificationReadUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationReadSelect<ExtArgs> | null;
    omit?: Prisma.UserNotificationReadOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserNotificationReadUpdateInput, Prisma.UserNotificationReadUncheckedUpdateInput>;
    where: Prisma.UserNotificationReadWhereUniqueInput;
};
export type UserNotificationReadUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserNotificationReadUpdateManyMutationInput, Prisma.UserNotificationReadUncheckedUpdateManyInput>;
    where?: Prisma.UserNotificationReadWhereInput;
    limit?: number;
};
export type UserNotificationReadUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationReadSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserNotificationReadOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserNotificationReadUpdateManyMutationInput, Prisma.UserNotificationReadUncheckedUpdateManyInput>;
    where?: Prisma.UserNotificationReadWhereInput;
    limit?: number;
};
export type UserNotificationReadUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationReadSelect<ExtArgs> | null;
    omit?: Prisma.UserNotificationReadOmit<ExtArgs> | null;
    where: Prisma.UserNotificationReadWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserNotificationReadCreateInput, Prisma.UserNotificationReadUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserNotificationReadUpdateInput, Prisma.UserNotificationReadUncheckedUpdateInput>;
};
export type UserNotificationReadDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationReadSelect<ExtArgs> | null;
    omit?: Prisma.UserNotificationReadOmit<ExtArgs> | null;
    where: Prisma.UserNotificationReadWhereUniqueInput;
};
export type UserNotificationReadDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserNotificationReadWhereInput;
    limit?: number;
};
export type UserNotificationReadDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationReadSelect<ExtArgs> | null;
    omit?: Prisma.UserNotificationReadOmit<ExtArgs> | null;
};
