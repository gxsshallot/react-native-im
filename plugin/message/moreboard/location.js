import { Delegate } from '../../../src';

export default {
    text: '位置',
    icon: require('./image/more_location.png'),
    onPress: ({onDataChange, navigation}) => {
        Delegate.func.pushToLocationChoosePage({
            onChange: (poiInfo) => onDataChange && onDataChange(poiInfo),
        });
    },
};