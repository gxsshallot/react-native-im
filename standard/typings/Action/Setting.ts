import React from 'react';
import { ChatType } from '../Conversation';
import { Navigation } from '../Props';
import * as Message from "react-native-im/standard/typings/Message";

export interface State {
    name: string;
    imId: string;
    chatType: ChatType;
}

export interface Params extends Navigation {
    key: string | number;
    imId: string;
    chatType: ChatType;
    onDataChange: () => void;
    onSendMessage: (message: Message.General) => void;
}

export type Result = React.ReactElement<Params>;
