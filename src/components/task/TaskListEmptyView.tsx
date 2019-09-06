import React from 'react'
import { View, Text } from 'react-native'


interface ItemComponentProps {
    content?: string
}


export default class TaskListEmptyComponent extends React.Component<ItemComponentProps> {

    constructor(props: ItemComponentProps) {
        super(props);

    }

  
    public render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: 603 }} >
                <Text style={{fontSize:15,color:"#000000",fontWeight:"400",opacity:0.75}}>{this.props.content}</Text>
            </View>
        );
    }
}
