import React from 'react';
import { TextInput, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import Dialog, { DialogTitle, DialogButton, DialogContent } from 'react-native-popup-dialog';
import i18n from '../../language';

export default class extends React.PureComponent {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        onCancel: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        textInputProps: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.onOrientationChange = this._onOrientationChange.bind(this);
        this.state = {
            text: null,
        };
    }

    componentDidMount() {
        Dimensions.addEventListener('change', this.onOrientationChange);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.onOrientationChange);
    }

    render() {
        const {visible, onCancel, onSubmit, textInputProps} = this.props;
        const {width, height} = Dimensions.get('window');
        const isLandscape = width > height;
        const marginTop = isLandscape ? 15 : 150;
        return (
            <Dialog
                visible={visible}
                onTouchOutside={onCancel}
                dialogTitle={this._renderPromptTitle()}
                width={300}
                dialogStyle={[styles.dialog, {marginTop}]}
                containerStyle={styles.container}
                actionContainerStyle={styles.footer}
                actions={[
                    <DialogButton
                        key={'cancel'}
                        text={i18n.t('IMCommonCancel')}
                        onPress={onCancel}
                        style={styles.action}
                        textStyle={styles.actionText}
                    />,
                    <DialogButton
                        key={'ok'}
                        text={i18n.t('IMCommonOK')}
                        onPress={() => onSubmit(this.state.text)}
                        style={styles.action}
                        textStyle={styles.actionText}
                    />
                ]}
            >
                <DialogContent style={styles.content}>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.setState({text})}
                        autoFocus={true}
                        {...textInputProps}
                    />
                </DialogContent>
            </Dialog>
        );
    }
    
    _renderPromptTitle() {
        const {title} = this.props;
        return (
            <DialogTitle
                title={title}
                style={styles.title}
                textStyle={styles.titleText}
            />
        );
    }

    _onOrientationChange() {
        this.forceUpdate();
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
    },
    dialog: {
        elevation: 5,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        overflow: 'hidden',
        borderColor: '#cccccc',
    },
    title: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        borderColor: '#cccccc',
    },
    titleText: {
        fontSize: 14,
    },
    content: {
        paddingHorizontal: 10
    },
    input: {
        height: 30,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#e6e6ea',
        paddingVertical: 0
    },
    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#e6e6ea',
        flexDirection: 'row',
        marginTop: 20,
        borderColor: '#cccccc',
    },
    action: {
        flex: 1,
        padding: 15,
    },
    actionText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666666'
    },
});