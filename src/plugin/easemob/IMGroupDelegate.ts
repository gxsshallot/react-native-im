import { GroupManager } from 'react-native-im-easemob';
import * as IMStandard from '../../standard';

export default function () {
    IMStandard.Delegate.im.group.loadList = () => {
        return GroupManager.getJoinedGroups();
    };
    // TODO
}