import { ImageSourcePropType } from 'react-native';

/**
 * 部门信息。
 */
export interface Org {
    /**
     * 部门ID。
     */
    orgId: string;
    /**
     * 部门名称。
     */
    name: string;
    /**
     * 部门名称拼音，用于搜索。
     */
    name_py?: string;
    /**
     * 父部门，如果为空，则表示是最上层的部门。
     */
    dept?: Org;
}

/**
 * 用户信息。
 */
export interface Item {
    /**
     * 用户ID。
     */
    userId: string;
    /**
     * 用户名称。
     */
    name: string;
    /**
     * 用户名称拼音，用于搜索。
     */
    name_py?: string;
    /**
     * 用户所属部门。
     */
    dept?: Org;
    /**
     * 用户头像。
     */
    avatar?: ImageSourcePropType;
    /**
     * 电话。
     */
    phone?: string;
    /**
     * 邮箱。
     */
    email?: string;
}

/**
 * 当前登陆用户信息。
 */
export interface Current extends Item {
    /**
     * 公司名称。
     */
    entName: string;
}

/**
 * 组织架构树的节点。
 */
export interface Node extends Org {
    children?: Array<Item | Node>;
}

/**
 * 组织架构树。
 */
export type Tree = Node | Node[];