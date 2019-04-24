import { ImageURISource, ImageRequireSource } from 'react-native';

/**
 * 群组的配置项。
 */
export interface Config {
    /**
     * 免打扰。
     */
    avoid: boolean;
    /**
     * 显示群成员昵称。
     */
    showMembersName: boolean;
    /**
     * 允许成员邀请他人。
     */
    allowInvite: boolean;
}

/**
 * 群组基础信息项。
 */
export interface Item extends Config {
    /**
     * 群组ID。
     */
    groupId: string;
    /**
     * 群主ID。
     */
    owner: string;
    /**
     * 成员ID列表，不包含owner。
     */
    members: string[];
    /**
     * 自定义群名称，如不存在，使用人名列表加上逗号拼接。
     */
    name?: string;
    /**
     * 自定义群名称的拼音，用于搜索。
     */
    name_py?: string;
    /**
     * 自定义群头像。
     */
    avatar?: ImageURISource | ImageRequireSource;
    /**
     * 创建时间的时间戳，单位是毫秒。
     */
    createdOn: number;
}

/**
 * 单个群组的抽象基类。
 */
export abstract class Base {
    /**
     * 群组基础信息项。
     */
    protected group: Item;

    /**
     * 构造函数。
     * @param group 外部传入的基础信息。
     */
    protected constructor(group: Item) {
        this.group = group;
    }

    /**
     * 更新群组信息。
     */
    public abstract async update(): Promise<void>;

    /**
     * 获取群组ID。
     */
    public abstract get groupId(): string;

    /**
     * 获取群主ID。
     */
    public abstract get owner(): string;

    /**
     * 更换群主ID。
     * @param newOwner 新群主ID。
     */
    public abstract async setOwner(newOwner: string): Promise<void>;

    /**
     * 获取群成员ID列表。
     * @param hasOwner 是否包含群主。
     */
    public abstract members(hasOwner: boolean): string;

    /**
     * 添加/删除群成员ID。
     * @param toAdd 待添加的列表。
     * @param toRemove 待删除的列表。
     */
    public abstract async setMembers(toAdd?: string[], toRemove?: string[]): Promise<void>;

    /**
     * 获取群名称。
     */
    public abstract get name(): string;

    /**
     * 设置群名称。
     * @param newName 新的自定义群名称。
     */
    public abstract async setName(newName: string): Promise<void>;

    /**
     * 获取群名称的拼音项。
     */
    public abstract get namePinyin(): string | void;

    /**
     * 设置自定义群名称的拼音。
     * @param newNamePinyin 新的自定义群名称拼音。
     */
    public abstract async setNamePinyin(newNamePinyin: string | void): Promise<void>;

    /**
     * 获取创建时间，单位毫秒。
     */
    public abstract get createdOn(): number;

    /**
     * 获取是否免打扰。
     */
    public abstract get avoid(): boolean;

    /**
     * 设置是否免打扰。
     * @param isAvoid 新的免打扰状态。
     */
    public abstract async setAvoid(isAvoid: boolean): Promise<boolean>;

    /**
     * 获取是否显示群成员昵称。
     */
    public abstract get showMembersName(): boolean;

    /**
     * 设置是否显示群成员昵称。
     * @param isShow 新的显示状态。
     */
    public abstract async setShowMembersName(isShow: boolean): Promise<boolean>;

    /**
     * 获取是否允许成员邀请他人。
     */
    public abstract get allowInvite(): boolean;

    /**
     * 设置是否允许成员邀请他人。
     * @param isAllowInvite 新的允许状态。
     */
    public abstract async setAllowInvite(isAllowInvite: boolean): Promise<boolean>;

    /**
     * 从外界收到有用户被邀请进入群组的通知。
     * @param invitor 邀请人ID。
     * @param joinedMembers 被邀请加入的用户ID列表。
     * @param localTime 本地时间戳。
     * @param timestamp 远程时间戳。
     */
    public abstract async onMemberJoin(
        invitor: string,
        joinedMembers: string[],
        localTime: number,
        timestamp: number
    ): Promise<void>;

    /**
     * 从外界收到有用户被移除出群组的通知。
     * @param operator 操作人ID。
     * @param leaveMembers 被移除的用户ID列表。
     * @param localTime 本地时间戳。
     * @param timestamp 远程时间戳。
     */
    public abstract async onMemberLeave(
        operator: string,
        leaveMembers: string[],
        localTime: number,
        timestamp: number
    ): Promise<void>;

    /**
     * 从外界收到更改群名称的通知。
     * @param operator 操作人ID。
     * @param newGroupName 新的群名称。
     * @param localTime 本地时间戳。
     * @param timestamp 远程时间戳。
     */
    public abstract async onUpdateName(
        operator: string,
        newGroupName: string,
        localTime: number,
        timestamp: number
    ): Promise<void>;

    /**
     * 从外界收到更改群主的通知。
     * @param newOwner 新的群主ID。
     * @param localTime 本地时间戳。
     * @param timestamp 远程时间戳。
     */
    public abstract async onUpdateOwner(
        newOwner: string,
        localTime: number,
        timestamp: number
    ): Promise<void>;
}