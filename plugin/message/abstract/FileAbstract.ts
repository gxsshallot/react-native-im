import { Typings } from '../../../standard';

export type Params = Typings.Action.Abstract.Params<Typings.Message.FileBody>;

export type Result = Typings.Action.Abstract.Result;

export default function (_: Params): Result {
    return '[文件]';
}