import { Group } from '../model';

/**
 * 群组相关的外部公共接口。
 */
export interface Interface {
    /**
     * 获取群组列表。
     */
    loadList(): Promise<Group.Item[]>;

    /**
     * 获取指定群组信息。
     * @param groupId 群组ID。
     */
    loadItem(groupId: string): Promise<Group.Item>;

    /**
     * 更新群组配置。
     * @param groupId 群组ID。
     * @param config 新的配置。
     */
    updateConfig(
        groupId: string,
        config: Partial<Group.Config>
    ): Promise<Partial<Group.Config>>;

    /**
     * 创建一个群组。
     * @param members 群成员ID列表，不包括群主。
     */
    createOne(members: string[]): Promise<Group.Item>;

    /**
     * 解散一个群组。
     * @param groupId 待解散的群组ID。
     */
    destroyOne(groupId: string): Promise<void>;

    /**
     * 退出一个群组。
     * @param groupId 待退出的群组ID。
     */
    quitOne(groupId: string): Promise<void>;

    /**
     * 添加群成员。
     * @param groupId 群组ID。
     * @param members 待添加的成员ID列表。
     */
    addMembers(groupId: string, members: string[]): Promise<void>;

    /**
     * 移除群成员。
     * @param groupId 群组ID。
     * @param members 待移除的群成员ID列表。
     */
    removeMembers(groupId: string, members: string[]): Promise<void>;

    /**
     * 更改群名称。
     * @param groupId 群组ID。
     * @param newName 新的群名称。
     */
    changeName(groupId: string, newName: string): Promise<void>;

    /**
     * 更改群头像。
     * @param groupId 群组ID。
     * @param newAvatarUrl 新的群头像URL地址。
     */
    changeAvatar(groupId: string, newAvatarUrl: string): Promise<void>;

    /**
     * 更改群主。
     * @param groupId 群组ID。
     * @param newOwner 新的群主ID。
     */
    changeOwner(groupId: string, newOwner: string): Promise<void>;
}