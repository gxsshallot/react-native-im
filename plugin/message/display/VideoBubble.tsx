import React from 'react';
import {ActivityIndicator, Image, Platform, StyleSheet, Text, View} from "react-native";
import Video from 'react-native-video';
import {Typings} from '../../../standard';
import OSSManager from 'core/oss/OSSManager';
import md5 from 'md5';
import RNFS from "react-native-fs";

import {IMStandard} from "react-native-im/index";


export type Props = Typings.Action.Display.Params<Typings.Message.VideoBody>;

export interface State {
    paused: boolean;
    downloadReady: boolean;
    displaySize?: Size;
}

class Size {
    width: number;
    height: number;
}

export default class extends React.PureComponent<Props, State> {
    protected player: Video | null;
    private isAndroid: Boolean = Platform.OS === 'android';
    state: State = {
        paused: true,
        downloadReady: false,
    };
    private remotePath: string;
    private localPath: string;
    private playableDuration: any;
    private displayPath: string;
    private maxDisplaySize: number;
    private size: Size;

    constructor(props: Props) {
        super(props);
        const {message: {data: {localPath, remotePath, playableDuration, size}}, maxWidth} = props;
        this.remotePath = remotePath;
        this.localPath = localPath;
        this.maxDisplaySize = maxWidth * 0.6;
        this.size = size;
        this.playableDuration = playableDuration;
    }

    render() {
        const content = this.state.downloadReady ? this._renderContent() : this._renderLoading();
        return (
            <View>
                {content}
            </View>
        );
    }

    _renderContent() {
        let content;
        if (this.isAndroid) {
            content = (
                <Image
                    style={[styles.video, {...this.state.displaySize}]}
                    resizeMode='cover'
                    source={{uri: this.displayPath}}
                />
            );
        } else {
            content = (
                <Video
                    source={{uri: this.displayPath}}
                    ref={(ref: Video | null) => this.player = ref}
                    style={[styles.video, {...this.state.displaySize}]}
                    paused={this.state.paused}
                    resizeMode="cover"
                    onFullscreenPlayerWillPresent={this._fullScreenPlayerWillPresent.bind(this)}
                    onFullscreenPlayerWillDismiss={this._fullScreenPlayerWillDismiss.bind(this)}
                />
            );
        }
        return (
            <View style={{justifyContent: 'flex-end'}}>
                {content}
                <Image
                    style={[styles.image, {...this.state.displaySize}]}
                    resizeMode='center'
                    source={require('./image/video_play.png')}
                />
                <Text style={{
                    position: 'absolute',
                    alignSelf: 'flex-end',
                    color: 'white',
                    paddingHorizontal: 10,
                    paddingVertical: 5
                }}
                >
                    {this._convertDuration(this.playableDuration)}
                </Text>
            </View>
        );
    }

    async _determinSize(size: Size, localPath: string): Promise<Size> {
        localPath = this._trimPrefix(localPath);
        if (Platform.OS === 'ios') {
            localPath = localPath.replace(RNFS.TemporaryDirectoryPath, 'tmp/');
        }
        const result = new Size();
        const radio = size.height / size.width;
        if (IMStandard.Delegate.func.getVideoMetaData === undefined) {
            result.width = this.maxDisplaySize;
            result.height = result.width * radio;
            return result;
        }
        let rotation = 90;
        try {
            const metaData = await IMStandard.Delegate.func.getVideoMetaData(localPath);
            rotation = metaData.rotation;
        } catch (e) {
            console.log(`get ${localPath} rotation failed!`);
        }
        //land or portrait
        if (rotation == 0 || rotation == 180) {
            result.width = this.maxDisplaySize;
            result.height = result.width * radio;
        } else {
            result.height = this.maxDisplaySize;
            result.width = result.height * radio;
        }

        return result;
    }

    _convertDuration(playableDuration: number) {
        const prefixWithZero = (time: number) => {
            if (time) {
                return time < 10 ? `0${time}` : `${time}`
            }
            return '00';
        };
        let duration = '';
        if (playableDuration) {
            let minute = Math.floor(playableDuration / 60);
            const second = playableDuration % 60;
            duration = `${prefixWithZero(minute)}:${prefixWithZero(second)}`;
        }
        return duration;
    }

    _renderLoading() {
        return <ActivityIndicator size="small"/>;
    }

    public onPress() {
        if (this.isAndroid) {
            if (this.state.downloadReady) {
                IMStandard.Delegate.func.playVideo(this.displayPath.replace('file://', ''));
            }
        } else {
            this.player.presentFullscreenPlayer();
        }
    }

    protected _fullScreenPlayerWillPresent() {
        this.player.seek(0);
        this.setState({
            paused: false,
        });
    }

    protected _fullScreenPlayerWillDismiss() {
        this.setState({
            paused: true,
        });
    }

    componentDidMount() {
        const checkTask = async () => {
            if (this.localPath != null && await RNFS.exists(this._trimPrefix(this.localPath))) {
                this.displayPath = this._filePrefix(this.localPath);
                this._determinSize(this.size, this.displayPath).then(size => {
                    this.setState({downloadReady: true, displaySize: size,});
                });

            } else {
                if (this.remotePath == null) {
                    return;
                }
                const exist = await RNFS.exists(this._generateLocalPath(this.remotePath));
                if (exist) {
                    this.displayPath = this._filePrefix(this._generateLocalPath(this.remotePath));
                    this._determinSize(this.size, this.displayPath).then(size => {
                        this.setState({downloadReady: true, displaySize: size,});
                    });
                } else {
                    this._downLoad();
                }
            }
        };
        checkTask();
    }

    async _downLoad() {
        const path = await OSSManager.downloadFile(this.remotePath, this._generateLocalPath(this.remotePath), (percent) => {
        });
        this.displayPath = this._filePrefix(path);
        this._determinSize(this.size, this.displayPath).then(size => {
            this.setState({downloadReady: true, displaySize: size,});
        });
    }

    _generateLocalPath(path: string) {
        if (this.isAndroid) {
            return `${RNFS.ExternalCachesDirectoryPath}/${md5(path)}.${path.split('.').pop()}`;
        } else {
            return `${RNFS.TemporaryDirectoryPath}/${md5(path)}.${path.split('.').pop()}`;
        }
    }

    _filePrefix(path: string) {
        if (path.startsWith('file://')) {
            return path;
        }
        return `file://${path}`;
    }

    _trimPrefix(path: string) {
        if (path.startsWith('file://')) {
            path = path.replace('file://', '');
        }
        return path;
    }

    componentWillUnmount() {
        if(this.player!=null){
            this.player.dismissFullscreenPlayer();
        }
    }
}


const styles = StyleSheet.create({
    video: {
        borderRadius: 5,
    },
    image: {
        position: 'absolute',
        borderRadius: 5,
        top: 0,
        backgroundColor: 'transparent',
    },
});
