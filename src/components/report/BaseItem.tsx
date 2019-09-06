import React from 'react'

export class BaseItemComponent<P = {}, S = {}, SS = any> extends React.PureComponent<P, S, SS> {
    public isVisible = false

    public refreshData(option?: object) {}
    public clear() {}
}