import * as React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { Typings, Delegate } from '../../../src';

export type Props = Typings.Action.DisplayHandleParams<Typings.Message.LocationBody>;

export default class extends React.PureComponent<Props> {
    render() {
        const {message: {data: {address, name}}, maxWidth} = this.props;
        return (
            <View>
                <View style={[styles.view, {width: maxWidth}]}>
                    <Text style={styles.name} numberOfLines={1}>
                        {name}
                    </Text>
                    <Text style={styles.address} numberOfLines={1}>
                        {address}
                    </Text>
                </View>
                <View style={styles.container}>
                    <Image
                        source={require('./image/location.png')}
                        style={[styles.image, {width: maxWidth}]}
                    />
                </View>
            </View>
        );
    }

    public onPress() {
        Delegate.func.pushToLocationViewPage(this.props.message.data);
    }
}

const styles = StyleSheet.create({
    view: {
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        backgroundColor: 'white',
    },
    name: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 12,
        fontSize: 16,
        color: 'gray',
        backgroundColor: 'transparent',
    },
    address: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        marginBottom: 5,
        fontSize: 12,
        backgroundColor: 'transparent',
    },
    container: {
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        overflow: 'hidden',
    },
    image: {
    },
});