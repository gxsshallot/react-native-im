export const Action = {
    Display: 'display',
    Parse: 'Parse',
    Generate: 'Generate',
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

export const BaseEvent = '__im_inner_event__';
export const ConversationConfigChangeEvent = '__im_conversation_config_change__';

export const SettingItemType = {
    Image: 'image',
    Text: 'text',
    Switch: 'switch',
};