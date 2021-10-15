import React from 'react';
import {Image, ImageURISource, Platform, StyleSheet, View} from 'react-native';
import RNFS from 'react-native-fs';
import {IMConstant} from 'react-native-im-easemob'
import {showPhotoBrowserPage} from 'react-native-photo-browse';
import {Typings} from '../../../standard';

export type Props = Typings.Action.Display.Params<Typings.Message.ImageBody>;

export interface State {
    source: ImageURISource | null;
}

export default class extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        const {message: {data}} = props;
        const {localPath, thumbnailLocalPath, remotePath, thumbnailRemotePath, size} = data;
        let source = null;
        if (thumbnailLocalPath || localPath) {
            if (Platform.OS === 'android') {
                let path = thumbnailLocalPath || localPath || '';
                if (!path.startsWith('file') && !path.startsWith('content')) {
                    path = 'file://' + path;
                }
                source = {uri: path};
            } else {
                // empty
            }
        } else {
            source = {uri: thumbnailRemotePath || remotePath};
        }
        this.state = {
            source: source,
            size: size && size.width && size.height ? size : undefined
        };
    }

    componentDidMount() {
        const {message: {data: {localPath, thumbnailLocalPath, size}}} = this.props;
        if (!this.state.source) {
            RNFS.readFile((thumbnailLocalPath || localPath) as string, 'base64')
                .then((content: string) => {
                    this.setState({
                        source: {uri: 'data:image/png;base64,' + content}
                    });
                });
        } else if (!this.state.size) {
            Image.getSize(this.state.source.uri, (width, height) => this.setState({size: {width, height}}));
        }
    }

    render() {
        const {maxWidth, style} = this.props;
        const {size} = this.state;
        const imgWidth = size && size.width || maxWidth;
        const imgHeight = size && size.height || maxWidth;
        const ratio = Math.max(imgWidth * 1.0 / maxWidth, imgHeight * 1.0 / maxWidth);
        const width = imgWidth / ratio;
        const height = imgHeight / ratio;
        return this.state.source ? (
            <View style={[styles.view, style]}>
                <Image
                    key={this.state.source}
                    resizeMode={'contain'}
                    source={this.state.source}
                    style={[styles.image, {width, height}]}
                    onError={this.onError}
                />
            </View>
        ) : null;
    }

    onError = () => this.setState({source: require('./image/load_error.png')})

    public onPress() {
        const {message: {data: {remotePath, localPath}, messageId}, messages = []} = this.props;

        if (!remotePath && !localPath) {
            return;
         }
         const images = messages.filter(({type, data: {remotePath: remoteP, localPath: localP}}) => {
             return type === IMConstant.MessageType.image &&
             ((remoteP && remoteP.length > 0) || (localP && localP.length > 0))
         }).reverse();
         const currentIndex = images.findIndex(image => image.messageId === messageId);
         showPhotoBrowserPage({
             currentIndex: currentIndex < 0 ? 0 : currentIndex,
             images: images.length === 0 ? [remotePath] : images.map(({data: {remotePath, localPath}}) => remotePath ? remotePath : localPath),
             canSave: true,
             renderIndicator: () => null,
         });
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
