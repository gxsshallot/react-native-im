import { Typings } from '../../standard';

export function convertBasicMessage<T extends Typings.Message.Body = Typings.Message.GeneralBody>(
    message: Typings.Message.Origin,
    type: number,
    data: T
): Typings.Message.General<T> {
    return {
        type: type,
        conversationId: message.conversationId,
        messageId: message.messageId,
        innerId: message.ext ? message.ext.innerId : undefined,
        status: message.status,
        from: message.from,
        to: message.to,
        localTime: message.localTime,
        timestamp: message.timestamp,
        data: data,
    };
}