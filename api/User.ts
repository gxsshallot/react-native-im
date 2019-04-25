import {ImageRequireSource, ImageURISource} from 'react-native';
import { User } from '../model';

export interface Interface {
    /**
     * 获取当前登陆的用户。
     */
    getMine(): User.Current;

    /**
     * 获取普通用户。
     * @param userId 用户ID。
     */
    getUser(userId: string): User.Item;

    /**
     * 获取所有用户列表。
     */
    loadAllUsers(): Promise<User.Item[]>;

    /**
     * 获取所有部门列表。
     */
    loadAllOrgs(): Promise<User.Org[]>;

    /**
     * 获取人员部门的组织架构树。
     * @param hasSelf 是否包含自己。
     * @param parentOrgId 根节点的部门ID，如果为空，则获取全部树。
     * @param excludedUserIds 排除的用户ID。
     */
    loadUserOrgTree?(
        hasSelf: boolean,
        parentOrgId: string | null,
        excludedUserIds: string[]
    ): Promise<User.Tree>;

    /**
     * 获取标星用户。
     */
    loadStarUser?(): Promise<User.Item[]>;

    /**
     * 获取用户的默认头像。
     * @param userId 用户ID。
     */
    getDefaultUserHeadImage(userId: string): ImageRequireSource | ImageURISource;

    /**
     * 跳转到用户详情页面。
     * @param userId 用户ID。
     */
    pushToUserDetailPage?(userId: string): void;

    /**
     * 根据用户头像URL地址，获取适配大小的URL。
     * @param avatar 头像URL地址。
     * @param size 头像大小。
     */
    fitAvatarForSize?(avatar: ImageRequireSource | ImageURISource, size: number): ImageRequireSource | ImageURISource;
}