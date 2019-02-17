export interface Org {
    orgId: string;
    name?: string;
    name_py?: string;
    dept?: Org;
    [key: string]: any;
}

export type OrgList = Org[];

export interface User {
    userId: string;
    name?: string;
    name_py?: string;
    dept?: Org;
    avatar?: string;
    phone?: string;
    email?: string;
    [key: string]: any;
}

export type UserList = User[];

export interface OrgTreeNode extends Org {
    children?: Array<User | OrgTreeNode>;
}

export type Tree = OrgTreeNode | OrgTreeNode[];

export interface CurrentUser extends User {
    entName?: string;
}