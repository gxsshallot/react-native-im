import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import { DisplayProps, VideoMessage } from '../proptype';

export default class extends React.PureComponent {
    static propTypes = DisplayProps(VideoMessage);

    constructor(props) {
        super(props);
        this.state = {
            paused: true,
        };
    }

    onPress = () => {
        this.player.presentFullscreenPlayer();
    };

    render() {
        const {message: {data: {localPath, remotePath}}, maxWidth} = this.props;
        const width = maxWidth;
        const height = maxWidth * 0.75;
        return (
            <View>
                <Video
                    source={{uri: localPath || remotePath}}
                    ref={ref => this.player = ref}
                    style={[styles.video, {width, height}]}
                    paused={this.state.paused}
                    resizeMode="cover"
                    onFullscreenPlayerWillPresent={this._fullScreenPlayerWillPresent}
                    onFullscreenPlayerWillDismiss={this._fullScreenPlayerWillDismiss}
                />
                <Image
                    style={[styles.image, {width, height}]}
                    resizeMode='center'
                    source={require('./image/video_play.png')}
                    opacity={0.5}
                />
            </View>
        );
    }

    _fullScreenPlayerWillPresent = () => {
        this.player.seek(0);
        this.setState({
            paused: false,
        });
    };

    _fullScreenPlayerWillDismiss = () => {
        this.setState({
            paused: true,
        });
    };
}

const styles = StyleSheet.create({
    video: {
        borderRadius: 5,
    },
    image: {
        position: 'absolute',
        borderRadius: 5,
        top: 0,
        backgroundColor:'gray',
    },
});