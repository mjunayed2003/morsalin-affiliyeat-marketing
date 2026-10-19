import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EmailOtpModel = runtime.Types.Result.DefaultSelection<Prisma.$EmailOtpPayload>;
export type AggregateEmailOtp = {
    _count: EmailOtpCountAggregateOutputType | null;
    _min: EmailOtpMinAggregateOutputType | null;
    _max: EmailOtpMaxAggregateOutputType | null;
};
export type EmailOtpMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    code: string | null;
    type: string | null;
    data: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
};
export type EmailOtpMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    code: string | null;
    type: string | null;
    data: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
};
export type EmailOtpCountAggregateOutputType = {
    id: number;
    email: number;
    code: number;
    type: number;
    data: number;
    expiresAt: number;
    createdAt: number;
    _all: number;
};
export type EmailOtpMinAggregateInputType = {
    id?: true;
    email?: true;
    code?: true;
    type?: true;
    data?: true;
    expiresAt?: true;
    createdAt?: true;
};
export type EmailOtpMaxAggregateInputType = {
    id?: true;
    email?: true;
    code?: true;
    type?: true;
    data?: true;
    expiresAt?: true;
    createdAt?: true;
};
export type EmailOtpCountAggregateInputType = {
    id?: true;
    email?: true;
    code?: true;
    type?: true;
    data?: true;
    expiresAt?: true;
    createdAt?: true;
    _all?: true;
};
export type EmailOtpAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EmailOtpWhereInput;
    orderBy?: Prisma.EmailOtpOrderByWithRelationInput | Prisma.EmailOtpOrderByWithRelationInput[];
    cursor?: Prisma.EmailOtpWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EmailOtpCountAggregateInputType;
    _min?: EmailOtpMinAggregateInputType;
    _max?: EmailOtpMaxAggregateInputType;
};
export type GetEmailOtpAggregateType<T extends EmailOtpAggregateArgs> = {
    [P in keyof T & keyof AggregateEmailOtp]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEmailOtp[P]> : Prisma.GetScalarType<T[P], AggregateEmailOtp[P]>;
};
export type EmailOtpGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EmailOtpWhereInput;
    orderBy?: Prisma.EmailOtpOrderByWithAggregationInput | Prisma.EmailOtpOrderByWithAggregationInput[];
    by: Prisma.EmailOtpScalarFieldEnum[] | Prisma.EmailOtpScalarFieldEnum;
    having?: Prisma.EmailOtpScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EmailOtpCountAggregateInputType | true;
    _min?: EmailOtpMinAggregateInputType;
    _max?: EmailOtpMaxAggregateInputType;
};
export type EmailOtpGroupByOutputType = {
    id: string;
    email: string;
    code: string;
    type: string;
    data: string | null;
    expiresAt: Date;
    createdAt: Date;
    _count: EmailOtpCountAggregateOutputType | null;
    _min: EmailOtpMinAggregateOutputType | null;
    _max: EmailOtpMaxAggregateOutputType | null;
};
export type GetEmailOtpGroupByPayload<T extends EmailOtpGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EmailOtpGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EmailOtpGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EmailOtpGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EmailOtpGroupByOutputType[P]>;
}>>;
export type EmailOtpWhereInput = {
    AND?: Prisma.EmailOtpWhereInput | Prisma.EmailOtpWhereInput[];
    OR?: Prisma.EmailOtpWhereInput[];
    NOT?: Prisma.EmailOtpWhereInput | Prisma.EmailOtpWhereInput[];
    id?: Prisma.StringFilter<"EmailOtp"> | string;
    email?: Prisma.StringFilter<"EmailOtp"> | string;
    code?: Prisma.StringFilter<"EmailOtp"> | string;
    type?: Prisma.StringFilter<"EmailOtp"> | string;
    data?: Prisma.StringNullableFilter<"EmailOtp"> | string | null;
    expiresAt?: Prisma.DateTimeFilter<"EmailOtp"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"EmailOtp"> | Date | string;
};
export type EmailOtpOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    data?: Prisma.SortOrderInput | Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EmailOtpWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.EmailOtpWhereInput | Prisma.EmailOtpWhereInput[];
    OR?: Prisma.EmailOtpWhereInput[];
    NOT?: Prisma.EmailOtpWhereInput | Prisma.EmailOtpWhereInput[];
    email?: Prisma.StringFilter<"EmailOtp"> | string;
    code?: Prisma.StringFilter<"EmailOtp"> | string;
    type?: Prisma.StringFilter<"EmailOtp"> | string;
    data?: Prisma.StringNullableFilter<"EmailOtp"> | string | null;
    expiresAt?: Prisma.DateTimeFilter<"EmailOtp"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"EmailOtp"> | Date | string;
}, "id">;
export type EmailOtpOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    data?: Prisma.SortOrderInput | Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.EmailOtpCountOrderByAggregateInput;
    _max?: Prisma.EmailOtpMaxOrderByAggregateInput;
    _min?: Prisma.EmailOtpMinOrderByAggregateInput;
};
export type EmailOtpScalarWhereWithAggregatesInput = {
    AND?: Prisma.EmailOtpScalarWhereWithAggregatesInput | Prisma.EmailOtpScalarWhereWithAggregatesInput[];
    OR?: Prisma.EmailOtpScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EmailOtpScalarWhereWithAggregatesInput | Prisma.EmailOtpScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"EmailOtp"> | string;
    email?: Prisma.StringWithAggregatesFilter<"EmailOtp"> | string;
    code?: Prisma.StringWithAggregatesFilter<"EmailOtp"> | string;
    type?: Prisma.StringWithAggregatesFilter<"EmailOtp"> | string;
    data?: Prisma.StringNullableWithAggregatesFilter<"EmailOtp"> | string | null;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"EmailOtp"> | Date | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"EmailOtp"> | Date | string;
};
export type EmailOtpCreateInput = {
    id?: string;
    email: string;
    code: string;
    type: string;
    data?: string | null;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type EmailOtpUncheckedCreateInput = {
    id?: string;
    email: string;
    code: string;
    type: string;
    data?: string | null;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type EmailOtpUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EmailOtpUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EmailOtpCreateManyInput = {
    id?: string;
    email: string;
    code: string;
    type: string;
    data?: string | null;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type EmailOtpUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EmailOtpUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EmailOtpCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    data?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EmailOtpMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    data?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EmailOtpMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    data?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EmailOtpSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    code?: boolean;
    type?: boolean;
    data?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["emailOtp"]>;
export type EmailOtpSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    code?: boolean;
    type?: boolean;
    data?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["emailOtp"]>;
export type EmailOtpSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    code?: boolean;
    type?: boolean;
    data?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["emailOtp"]>;
export type EmailOtpSelectScalar = {
    id?: boolean;
    email?: boolean;
    code?: boolean;
    type?: boolean;
    data?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
};
export type EmailOtpOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "email" | "code" | "type" | "data" | "expiresAt" | "createdAt", ExtArgs["result"]["emailOtp"]>;
export type $EmailOtpPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "EmailOtp";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        email: string;
        code: string;
        type: string;
        data: string | null;
        expiresAt: Date;
        createdAt: Date;
    }, ExtArgs["result"]["emailOtp"]>;
    composites: {};
};
export type EmailOtpGetPayload<S extends boolean | null | undefined | EmailOtpDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EmailOtpPayload, S>;
export type EmailOtpCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EmailOtpFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EmailOtpCountAggregateInputType | true;
};
export interface EmailOtpDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['EmailOtp'];
        meta: {
            name: 'EmailOtp';
        };
    };
    findUnique<T extends EmailOtpFindUniqueArgs>(args: Prisma.SelectSubset<T, EmailOtpFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EmailOtpClient<runtime.Types.Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EmailOtpFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EmailOtpFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EmailOtpClient<runtime.Types.Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EmailOtpFindFirstArgs>(args?: Prisma.SelectSubset<T, EmailOtpFindFirstArgs<ExtArgs>>): Prisma.Prisma__EmailOtpClient<runtime.Types.Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EmailOtpFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EmailOtpFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EmailOtpClient<runtime.Types.Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EmailOtpFindManyArgs>(args?: Prisma.SelectSubset<T, EmailOtpFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EmailOtpCreateArgs>(args: Prisma.SelectSubset<T, EmailOtpCreateArgs<ExtArgs>>): Prisma.Prisma__EmailOtpClient<runtime.Types.Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EmailOtpCreateManyArgs>(args?: Prisma.SelectSubset<T, EmailOtpCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EmailOtpCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EmailOtpCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EmailOtpDeleteArgs>(args: Prisma.SelectSubset<T, EmailOtpDeleteArgs<ExtArgs>>): Prisma.Prisma__EmailOtpClient<runtime.Types.Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EmailOtpUpdateArgs>(args: Prisma.SelectSubset<T, EmailOtpUpdateArgs<ExtArgs>>): Prisma.Prisma__EmailOtpClient<runtime.Types.Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EmailOtpDeleteManyArgs>(args?: Prisma.SelectSubset<T, EmailOtpDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EmailOtpUpdateManyArgs>(args: Prisma.SelectSubset<T, EmailOtpUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EmailOtpUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EmailOtpUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EmailOtpUpsertArgs>(args: Prisma.SelectSubset<T, EmailOtpUpsertArgs<ExtArgs>>): Prisma.Prisma__EmailOtpClient<runtime.Types.Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EmailOtpCountArgs>(args?: Prisma.Subset<T, EmailOtpCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EmailOtpCountAggregateOutputType> : number>;
    aggregate<T extends EmailOtpAggregateArgs>(args: Prisma.Subset<T, EmailOtpAggregateArgs>): Prisma.PrismaPromise<GetEmailOtpAggregateType<T>>;
    groupBy<T extends EmailOtpGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EmailOtpGroupByArgs['orderBy'];
    } : {
        orderBy?: EmailOtpGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EmailOtpGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmailOtpGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EmailOtpFieldRefs;
}
export interface Prisma__EmailOtpClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EmailOtpFieldRefs {
    readonly id: Prisma.FieldRef<"EmailOtp", 'String'>;
    readonly email: Prisma.FieldRef<"EmailOtp", 'String'>;
    readonly code: Prisma.FieldRef<"EmailOtp", 'String'>;
    readonly type: Prisma.FieldRef<"EmailOtp", 'String'>;
    readonly data: Prisma.FieldRef<"EmailOtp", 'String'>;
    readonly expiresAt: Prisma.FieldRef<"EmailOtp", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"EmailOtp", 'DateTime'>;
}
export type EmailOtpFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailOtpSelect<ExtArgs> | null;
    omit?: Prisma.EmailOtpOmit<ExtArgs> | null;
    where: Prisma.EmailOtpWhereUniqueInput;
};
export type EmailOtpFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailOtpSelect<ExtArgs> | null;
    omit?: Prisma.EmailOtpOmit<ExtArgs> | null;
    where: Prisma.EmailOtpWhereUniqueInput;
};
export type EmailOtpFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailOtpSelect<ExtArgs> | null;
    omit?: Prisma.EmailOtpOmit<ExtArgs> | null;
    where?: Prisma.EmailOtpWhereInput;
    orderBy?: Prisma.EmailOtpOrderByWithRelationInput | Prisma.EmailOtpOrderByWithRelationInput[];
    cursor?: Prisma.EmailOtpWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EmailOtpScalarFieldEnum | Prisma.EmailOtpScalarFieldEnum[];
};
export type EmailOtpFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailOtpSelect<ExtArgs> | null;
    omit?: Prisma.EmailOtpOmit<ExtArgs> | null;
    where?: Prisma.EmailOtpWhereInput;
    orderBy?: Prisma.EmailOtpOrderByWithRelationInput | Prisma.EmailOtpOrderByWithRelationInput[];
    cursor?: Prisma.EmailOtpWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EmailOtpScalarFieldEnum | Prisma.EmailOtpScalarFieldEnum[];
};
export type EmailOtpFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailOtpSelect<ExtArgs> | null;
    omit?: Prisma.EmailOtpOmit<ExtArgs> | null;
    where?: Prisma.EmailOtpWhereInput;
    orderBy?: Prisma.EmailOtpOrderByWithRelationInput | Prisma.EmailOtpOrderByWithRelationInput[];
    cursor?: Prisma.EmailOtpWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EmailOtpScalarFieldEnum | Prisma.EmailOtpScalarFieldEnum[];
};
export type EmailOtpCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailOtpSelect<ExtArgs> | null;
    omit?: Prisma.EmailOtpOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EmailOtpCreateInput, Prisma.EmailOtpUncheckedCreateInput>;
};
export type EmailOtpCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EmailOtpCreateManyInput | Prisma.EmailOtpCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EmailOtpCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailOtpSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EmailOtpOmit<ExtArgs> | null;
    data: Prisma.EmailOtpCreateManyInput | Prisma.EmailOtpCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EmailOtpUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailOtpSelect<ExtArgs> | null;
    omit?: Prisma.EmailOtpOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EmailOtpUpdateInput, Prisma.EmailOtpUncheckedUpdateInput>;
    where: Prisma.EmailOtpWhereUniqueInput;
};
export type EmailOtpUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EmailOtpUpdateManyMutationInput, Prisma.EmailOtpUncheckedUpdateManyInput>;
    where?: Prisma.EmailOtpWhereInput;
    limit?: number;
};
export type EmailOtpUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailOtpSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EmailOtpOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EmailOtpUpdateManyMutationInput, Prisma.EmailOtpUncheckedUpdateManyInput>;
    where?: Prisma.EmailOtpWhereInput;
    limit?: number;
};
export type EmailOtpUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailOtpSelect<ExtArgs> | null;
    omit?: Prisma.EmailOtpOmit<ExtArgs> | null;
    where: Prisma.EmailOtpWhereUniqueInput;
    create: Prisma.XOR<Prisma.EmailOtpCreateInput, Prisma.EmailOtpUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EmailOtpUpdateInput, Prisma.EmailOtpUncheckedUpdateInput>;
};
export type EmailOtpDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailOtpSelect<ExtArgs> | null;
    omit?: Prisma.EmailOtpOmit<ExtArgs> | null;
    where: Prisma.EmailOtpWhereUniqueInput;
};
export type EmailOtpDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EmailOtpWhereInput;
    limit?: number;
};
export type EmailOtpDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailOtpSelect<ExtArgs> | null;
    omit?: Prisma.EmailOtpOmit<ExtArgs> | null;
};
