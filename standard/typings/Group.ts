/**
 * Group item.
 */
export interface Item {
    groupId: string;
    owner: string;
    members: string[];
    name?: string;
    name_py?: string;
    avatar?: string;
    createdOn?: number;
    allowInvites?: boolean;
    announcement?: string;
}
