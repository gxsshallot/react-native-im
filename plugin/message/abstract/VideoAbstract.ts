import { Typings } from '../../../src';

export type Params = Typings.Action.AbstractHandleParams<Typings.Message.Video>;

export type Result = Typings.Action.AbstractHandleResult;

export default function (_: Params): Result {
    return '[视频]';
}