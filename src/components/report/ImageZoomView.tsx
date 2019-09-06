import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import FastImage from 'react-native-fast-image';
import { ImageModel } from '../../services/qiniu';

interface OwnProps {
    imageList?: Array<ImageModel> | undefined
    nowChoose?: number,
    show: boolean,
    onRequestClose: () => void
}

const ImageZoomView: React.SFC<OwnProps> = ({ imageList, nowChoose, show, onRequestClose }) => {
    return (
        <Modal
            visible={show}
            onRequestClose={onRequestClose}
            transparent={true}>
            <View style={{ flex: 1, backgroundColor: "#000" }}>
                {
                    imageList && imageList.length > 0 &&
                    <Swiper loop={false} autoplay={false} showsButtons index={nowChoose} dot={<View style={{ backgroundColor: '#ffffff', width: 5, height: 5, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3 }} />}>
                        {
                            imageList.map(image => {
                                return (
                                    <TouchableOpacity style={{ flex: 1 }} key={`~${image.path}`} onPress={onRequestClose}>
                                        <FastImage source={{ uri: image.remoteUrl || 'file://' + image.path }} style={{ flex: 1 }} resizeMode={FastImage.resizeMode.contain} />
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </Swiper>
                }

            </View>
        </Modal>
    )
}
export default ImageZoomView 