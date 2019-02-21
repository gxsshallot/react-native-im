/**
 * Department with multi user.
 */
export interface Org {
    orgId: string;
    name?: string;
    name_py?: string;
    dept?: Org;
    [key: string]: any;
}

/**
 * User information.
 */
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

/**
 * Organization tree node.
 */
export interface OrgTreeNode extends Org {
    children?: Array<User | OrgTreeNode>;
}

/**
 * A whole organization tree.
 */
export type Tree = OrgTreeNode | OrgTreeNode[];

/**
 * Current login user information.
 */
export interface CurrentUser extends User {
    entName?: string;
}