import { Delegate } from '../../../src';

export default {
    text: '位置',
    icon: require('./image/more_location.png'),
    onPress: ({onDataChange, _}) => {
        Delegate.func.pushToLocationChoosePage({
            onChange: (poiInfo) => onDataChange && onDataChange(poiInfo),
        });
    },
};