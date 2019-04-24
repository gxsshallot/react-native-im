import { ImageURISource, ImageRequireSource } from 'react-native';

/**
 * 群组基础信息项。
 */
export interface Item {
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
 * 群组扩展信息项。
 */
type Extension = {
    [key: string]: any;
};

/**
 * 单个群组的抽象基类。
 */
export abstract class Base {
    /**
     * 群组基础信息项。
     */
    protected group: Item;

    /**
     * 群组扩展信息项。
     */
    protected ext: Extension;

    /**
     * 构造函数。
     * @param group 外部传入的基础信息。
     * @param ext 外部传入的扩展信息。
     */
    protected constructor(group: Item, ext: Extension = {}) {
        this.group = group;
        this.ext = ext;
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
     * 获取扩展信息项。
     */
    public abstract get extension(): Extension;

    /**
     * 设置扩展信息项。
     * @param newExt 新的扩展信息。
     */
    public abstract async setExtension(newExt: Partial<Extension>): Promise<void>;

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