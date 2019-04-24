import * as Group from './Group';

/**
 * 群组管理器的抽象基类。
 */
export abstract class Base {
    /**
     * 群组映射关系，以群组ID为索引。
     */
    protected groups: {[groupId: string]: Group.Base} = {};

    /**
     * 初始化管理器。
     * @param forceUpdate 是否强制刷新群组列表。
     */
    public abstract async init(forceUpdate: boolean): Promise<void>;

    /**
     * 反初始化管理器。
     * @param forceClear 是否强制清除本地持久化数据。
     */
    public abstract async uninit(forceClear: boolean): Promise<void>;

    /**
     * 刷新群组列表。
     */
    public abstract async load(): Promise<void>;

    /**
     * 获取群组列表。
     */
    public abstract get(): Group.Base[];

    /**
     * 根据群组ID查找群组。
     * @param groupId 待查找的群组ID。
     */
    public abstract findByGroupId(groupId: string): Group.Base | void;

    /**
     * 创建一个群组。
     * @param members 群成员ID列表，不包含群主。
     */
    public abstract async createOne(members: string[]): Promise<Group.Base>;

    /**
     * 解散群组，当前用户为群主时的操作。
     * @param groupId 待解散的群组ID。
     */
    public abstract async destroyOne(groupId: string): Promise<void>;

    /**
     * 退出群组，当前用户为群成员时的操作。
     * @param groupId 待退出的群组ID。
     */
    public abstract async quitOne(groupId: string): Promise<void>;

    /**
     * 从外界收到创建群组的通知信息。
     * @param groupId 创建的群组ID。
     * @param localTime 本地时间戳。
     * @param timestamp 远程时间戳。
     */
    public abstract async onGroupCreate(
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
    public abstract async onGroupDelete(
        groupId: string,
        localTime: number,
        timestamp: number
    ): Promise<void>;
}