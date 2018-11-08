import React from 'react';
import { StyleSheet, View, Platform, InteractionManager } from 'react-native';
import RNFS from 'react-native-fs';
import Image from 'react-native-scalable-image';
import { DisplayProps, ImageMessage } from '../proptype';

export default class extends React.PureComponent {
    static propTypes = DisplayProps(ImageMessage);

    constructor(props) {
        super(props);
        const {message: {data: {localPath, thumbnailPath, size}}} = this.props;
        let source = null;
        if (thumbnailPath) {
            source = {uri: thumbnailPath};
        } else if (Platform.OS === 'android') {
            source = {uri: localPath};
        }
        this.state = {
            source: source,
        };
    }

    componentDidMount() {
        const {message: {data: {localPath, thumbnailPath}}} = this.props;
        if (!this.state.source) {
            RNFS.readFile(localPath, 'base64')
                .then(content => {
                    this.setState({
                        source: {uri: 'data:image/png;base64,' + content}
                    });
                });
        }
    }

    render() {
        const {message: {data: {size}}, maxWidth, style} = this.props;
        const width = size && size.width || maxWidth;
        const height = size && size.height || maxWidth;
        return this.state.source ? (
            <View style={[styles.view, style]}>
                <Image
                    resizeMode={'contain'}
                    source={this.state.source}
                    style={[styles.image, {width, height}]}
                />
            </View>
        ) : null;
    }
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: 'transparent',
    },
    image: {
        borderRadius: 5,
    },
});
