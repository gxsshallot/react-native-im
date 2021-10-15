import React from 'react';
import { TextInput, StyleSheet, Dimensions, TextInputProps, Keyboard, Platform } from 'react-native';
import Modal, { ModalTitle, ModalButton, ModalContent, ModalFooter} from 'react-native-modals';
import i18n from 'i18n-js';

const isAndroid = Platform.OS === 'android';

export interface Props {
    visible: boolean;
    title: string;
    onCancel: () => void;
    onSubmit: (text: string) => void;
    textInputProps: TextInputProps;
}

export interface State {
    text: string;
    keyBoardShow: boolean
}

export default class extends React.PureComponent<Props, State> {
    state: State = {
        text: '',
        keyBoardShow: false
    };
    keyboardDidShowListener: any;
    keyboardDidHideListener: any;

    constructor(props: Props) {
        super(props);
        this._onOrientationChange = this._onOrientationChange.bind(this);
    }

    componentDidMount() {
        Dimensions.addEventListener('change', this._onOrientationChange);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this._onOrientationChange);
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow(e: any) {
        this.setState({
            keyBoardShow: true
        });
    }
    _keyboardDidHide() {
        this.setState({
            keyBoardShow: false
        });
    }

    render() {
        const {visible, onCancel, onSubmit, textInputProps} = this.props;
        const {width, height} = Dimensions.get('window');
        const dialogWidth = Math.min(width - 15 * 2, 300);
        const marginStyle = isAndroid ? {} : {marginBottom: this.state.keyBoardShow ? height / 2 : 0};
        return (
            <Modal
                visible={visible}
                onTouchOutside={onCancel}
                modalTitle={this._renderPromptTitle()}
                width={dialogWidth}
                modalStyle={[styles.dialog, marginStyle]}
                containerStyle={styles.container}
                footer={
                    <ModalFooter style={styles.footer}>
                        <ModalButton
                            key={'cancel'}
                            text={i18n.t('IMCommonCancel')}
                            onPress={onCancel}
                            style={styles.action}
                            textStyle={styles.actionText}
                        />
                        <ModalButton
                            key={'ok'}
                            text={i18n.t('IMCommonOK')}
                            onPress={() => onSubmit(this.state.text)}
                            style={styles.action}
                            textStyle={styles.actionText}
                        />
                    </ModalFooter>
                }
            >
                <ModalContent style={styles.content}>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.setState({text})}
                        autoFocus={true}
                        {...textInputProps}
                    />
                </ModalContent>
            </Modal>
        );
    }
    
    protected _renderPromptTitle() {
        const {title} = this.props;
        return (
            <ModalTitle
                title={title}
                style={styles.title}
                textStyle={styles.titleText}
            />
        );
    }

    protected _onOrientationChange() {
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