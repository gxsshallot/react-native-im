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
export const ConversationEvent = '__im_conversation__';
export const UnreadCountEvent = '__im_unread_count__';
export const GroupEvent = '__im_group__';
export const SendMessageEvent = '__im_send_message__';
export const ReceiveMessageEvent = '__im_receive_message__';
export const RecallMessageEvent = '__im_recall_message__';
export const StarUserChangeEvent = '__im_star_user_change__';