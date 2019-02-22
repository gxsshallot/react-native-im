import { Typings } from '../../../standard';

export type Params = Typings.Action.AbstractHandleParams<Typings.Message.VideoBody>;

export type Result = Typings.Action.AbstractHandleResult;

export default function (_: Params): Result {
    return '[视频]';
}