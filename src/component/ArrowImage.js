import React from 'react';
import { StyleSheet, Image } from 'react-native';

export default class extends React.PureComponent {
    static defaultProps = {
        image: require('./image/arrow_right.png'),
    };

    render() {
        const {image, style} = this.props;
        return (
            <Image
                source={image}
                style={[styles.image, style]}
            />
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width: 13,
        height: 16,
    },
});