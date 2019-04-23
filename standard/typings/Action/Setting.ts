import React from 'react';
import { ChatType } from '../Conversation';
import { Navigation } from '../Props';

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
}

export type Result = React.ReactElement<Params>;