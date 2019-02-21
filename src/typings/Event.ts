/**
 * Base event for all events.
 * Other event's format is [BaseEvent, xxxEvent, xxx].
 */
export const BaseEvent = '__im_inner_event__';

export const ConversationEvent = '__im_conversation__';
export const UnreadCountEvent = '__im_unread_count__';
export const GroupEvent = '__im_group__';
export const SendMessageEvent = '__im_send_message__';
export const ReceiveMessageEvent = '__im_receive_message__';
export const RecallMessageEvent = '__im_recall_message__';
export const StarUserChangeEvent = '__im_star_user_change__';