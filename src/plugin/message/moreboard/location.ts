import { Typings, Delegate } from '../../../standard';

export type Result = Typings.Action.MoreBoardHandleGeneralResult<Typings.Message.LocationBody>;

export type Params = Typings.Action.MoreBoardHandlePressParams<Typings.Message.LocationBody>;

const obj: Result = {
    text: '位置',
    icon: require('../../../../image/more_location.png'),
    onPress: (params: Params) => {
        Delegate.func.pushToLocationChoosePage({
            onChange: params.onDataChange,
        });
    },
};

export default obj;