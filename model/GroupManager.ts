import * as Group from './Group';

/**
 * 群组管理器的公共接口。
 */
export interface Interface {
    /**
     * 初始化管理器。
     * @param forceUpdate 是否强制刷新群组列表。
     */
    init(forceUpdate: boolean): Promise<void>;

    /**
     * 反初始化管理器。
     * @param forceClear 是否强制清除本地持久化数据。
     */
    uninit(forceClear: boolean): Promise<void>;

    /**
     * 刷新群组列表。
     */
    load(): Promise<void>;

    /**
     * 获取群组列表。
     */
    get(): Group.Interface[];

    /**
     * 根据群组ID查找群组，确定存在，如不存在抛出异常。
     * @param groupId 待查找的群组ID。
     */
    getOne(groupId: string): Group.Interface;

    /**
     * 根据群组ID查找群组，不确定是否存在。
     * @param groupId 待查找的群组ID。
     */
    findByGroupId(groupId: string): Group.Interface | void;

    /**
     * 创建一个群组。
     * @param members 群成员ID列表，不包含群主。
     */
    createOne(members: string[]): Promise<Group.Interface>;

    /**
     * 解散群组，当前用户为群主时的操作。
     * @param groupId 待解散的群组ID。
     */
    destroyOne(groupId: string): Promise<void>;

    /**
     * 退出群组，当前用户为群成员时的操作。
     * @param groupId 待退出的群组ID。
     */
    quitOne(groupId: string): Promise<void>;

    /**
     * 从外界收到创建群组的通知信息。
     * @param groupId 创建的群组ID。
     * @param localTime 本地时间戳。
     * @param timestamp 远程时间戳。
     */
    onGroupCreate(
        groupId: string,
        localTime: number,
        timestamp: number
    ): Promise<void>;

    /**
     * 从外界收到删除群组的通知信息。
     * @param groupId 删除的群组ID。
     * @param localTime 本地时间戳。
     * @param timestamp 远程时间戳。
     */
    onGroupDelete(
        groupId: string,
        localTime: number,
        timestamp: number
    ): Promise<void>;
}