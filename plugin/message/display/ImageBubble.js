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
        if (thumbnailLocalPath || localPath) {
            if (Platform.OS === 'android') {
                source = {uri: thumbnailLocalPath || localPath};
            } else {
                // empty
            }
        } else {
            source = {uri: thumbnailRemotePath || remotePath};
        }
        this.state = {
            source: source,
        };
    }

    componentDidMount() {
        const {message: {data: {localPath, thumbnailLocalPath}}} = this.props;
        if (!this.state.source) {
            RNFS.readFile(thumbnailLocalPath || localPath, 'base64')
                .then(content => {
                    this.setState({
                        source: {uri: 'data:image/png;base64,' + content}
                    });
                });
        }
    }

    render() {
        const {message: {data: {size}}, maxWidth, style} = this.props;
        const imgWidth = size && size.width || maxWidth;
        const imgHeight = size && size.height || maxWidth;
        const ratio = Math.max(imgWidth * 1.0 / maxWidth, imgHeight * 1.0 / maxWidth);
        const width = imgWidth / ratio;
        const height = imgHeight / ratio;
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
