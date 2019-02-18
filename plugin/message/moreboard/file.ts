import { Typings } from '../../../src';

export type Result = Typings.Action.MoreBoardHandleGeneralResult<Typings.Message.FileBody>;

export type Params = Typings.Action.MoreBoardHandlePressParams<Typings.Message.FileBody>;

const obj: Result = {
    text: '文件',
    icon: require('./image/more_file.png'),
    onPress: (_: Params) => {
        // TODO 更多面板文件点击事件
    },
};

export default obj;