/**
 * Base event for all events.
 * Other event's format is [BaseEvent, xxxEvent, xxx].
 */
export const Base = '__im_inner_event__';

export const Conversation = '__im_conversation__';
export const UnreadCount = '__im_unread_count__';
export const Group = '__im_group__';
export const GroupLeave = '__im_group_leave__';
export const SendMessage = '__im_send_message__';
export const ReceiveMessage = '__im_receive_message__';
export const StarUserChange = '__im_star_user_change__';