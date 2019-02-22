import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import { Typings } from '../../../standard';

export type Props = Typings.Action.DisplayHandleParams<Typings.Message.VideoBody>;

export interface State {
    paused: boolean;
}

export default class extends React.PureComponent<Props, State> {
    protected player: Video | null;

    state: State = {
        paused: true,
    };

    render() {
        const {message: {data: {localPath, remotePath}}, maxWidth} = this.props;
        const width = maxWidth;
        const height = maxWidth * 0.75;
        return (
            <View>
                <Video
                    source={{uri: localPath || remotePath}}
                    ref={(ref: Video | null) => this.player = ref}
                    style={[styles.video, {width, height}]}
                    paused={this.state.paused}
                    resizeMode="cover"
                    onFullscreenPlayerWillPresent={this._fullScreenPlayerWillPresent.bind(this)}
                    onFullscreenPlayerWillDismiss={this._fullScreenPlayerWillDismiss.bind(this)}
                />
                <Image
                    style={[styles.image, {width, height}]}
                    resizeMode='center'
                    source={require('../../../../image/video_play.png')}
                />
            </View>
        );
    }

    public onPress() {
        this.player.presentFullscreenPlayer();
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