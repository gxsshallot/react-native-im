export const Action = {
    Display: 'display',
    Parse: 'Parse',
    Send: 'send',
    Abstract: 'abstract',
    MoreBoard: 'moreboard',
};

export const Status = {
    Pending: 0,
    Delivering: 1,
    Succeed: 2,
    Failed: 3,
};

export const ChatType = {
    Single: 0,
    Group: 1,
};

export const StoragePart = 'im_storage_part';

export const atAll = '__at_all_message__';

export const BaseEvent = '__im_inner_event__';
export const ConversationUpdateEvent = '__im_conversation_update__';
export const UnreadMessageCountChangeEvent = '__im_unread_message_count_change__';
export const GroupUpdateEvent = '__im_group_update__';
export const SendMessageEvent = '__im_send_message__';
export const ReceiveMessageEvent = '__im_receive_message__';
export const RecallMessageEvent = '__im_recall_message__';
export const SystemMessageEvent = '__im_system_message__';

export const SettingItemType = {
    Image: 'image',
    Text: 'text',
    Switch: 'switch',
};