import * as React from 'react';
import { Typings } from '../../src';

export interface UiParams extends Typings.Component.NavigationProps {
    key: number | string;
    imId: string;
    chatType: Typings.Conversation.ChatType;
    onDataChange: () => void;
}

export type UiResult = React.ReactElement | null;

export type Action = (props: UiParams) => UiResult;