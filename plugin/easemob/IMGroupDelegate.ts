import { GroupManager } from 'react-native-im-easemob';
import * as IMStandard from '../../src';

export default function () {
    IMStandard.Delegate.im.group.loadList = () => {
        return GroupManager.getJoinedGroups()
            .then((result) => {
                console.log(result);
                return result;
            });
    };
    // TODO
}