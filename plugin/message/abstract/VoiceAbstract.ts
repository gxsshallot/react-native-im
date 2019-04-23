import { Typings } from '../../../standard';

export type Params = Typings.Action.Abstract.Params<Typings.Message.VoiceBody>;

export type Result = Typings.Action.Abstract.Result;

export default function (_: Params): Result {
    return '[语音]';
}