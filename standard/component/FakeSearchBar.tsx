import React from 'react';
import { SafeAreaView } from 'react-native';
import { forceInset } from '@hecom/react-native-pure-navigation-bar';
import { FakeSearchBar } from 'react-native-general-searchbar';

export default class extends React.PureComponent {
    render() {
        return (
            <SafeAreaView
                style={styles.safeview}
                forceInset={forceInset(0, 1, 0, 1)}
            >
                <FakeSearchBar
                    style={styles}
                    {...this.props}
                />
            </SafeAreaView>
        );
    }
}

const styles = {
    safeview: {
        height: 35 + 7 * 2,
        backgroundColor: '#efeff4',
    },
    touch: {
        flex: 1,
        height: 35,
        margin: 7,
        borderRadius: 5,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    image: {
        width: 14,
        height: 14,
        marginRight: 6,
    },
    text: {
        flex: 0,
        fontSize: 14,
        color: '#aaaaaa',
    },
};