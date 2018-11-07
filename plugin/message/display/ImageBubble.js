import React from 'react';
import { Image, StyleSheet, View, Platform, InteractionManager } from 'react-native';
import RNFS from 'react-native-fs';
import { DisplayProps, ImageMessage } from '../proptype';

export default class extends React.PureComponent {
    static propTypes = DisplayProps(ImageMessage);

    constructor(props) {
        super(props);
        const {message: {data: {localPath, thumbnailPath}}} = this.props;
        let source = null;
        if (thumbnailPath) {
            source = {uri: thumbnailPath};
        } else if (Platform.OS === 'android') {
            source = {uri: localPath};
        }
        this.state = {
            source: source,
            width: null,
            height: null,
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
        Image.getSize(thumbnailPath, (width, height) => {
            this.setState({width, height});
        });
    }

    render() {
        const {maxWidth, style} = this.props;
        const imgWidth = this.state.width || maxWidth;
        const imgHeight = this.state.height || maxWidth;
        const ratio = Math.max(imgWidth / maxWidth, imgHeight / maxWidth);
        return this.state.source && this.state.width && this.state.height ? (
            <View style={[styles.view, style]}>
                <Image
                    resizeMode={'contain'}
                    source={this.state.source}
                    style={[styles.image, {
                        width: imgWidth / ratio,
                        height: imgHeight / ratio,
                    }]}
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
