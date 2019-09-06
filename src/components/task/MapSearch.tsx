import React from 'react'
import { View, Image, TextInput, TouchableOpacity, Text, Keyboard, ActivityIndicator } from 'react-native'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam, } from 'react-redux'
import { ReduxStore } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import { NavigationScreenProp } from 'react-navigation'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { NavigationRoute } from 'react-navigation'
import { FlatList } from 'react-native-gesture-handler';
import { throttle } from 'lodash'
import { OpenedStore } from '../../types/opened-store';
import { FetchAllOpenedStoresActionFunction, fetchAllOpenedStores } from '../../actions/opened-store';

const statusBarHeight = getStatusBarHeight(true)

interface StoreItemComponentProps {
	item: OpenedStore
	onPress: (openedStore: OpenedStore) => void,
	nowKeyWords?: string
}

class StoreItemComponent extends React.Component<StoreItemComponentProps, any> {
	constructor(props: StoreItemComponentProps) {
		super(props);
	}

	private onPress = () => {
		this.props.onPress && this.props.onPress(this.props.item)
	}

	private onCheckStoreName = (storeName: string) => {
		let keyword = this.props.nowKeyWords ? this.props.nowKeyWords : ""
		let customList = []
		if (storeName.indexOf(keyword) == -1) {
			customList.push(<Text >{storeName}</Text>)
			return customList
		}
		let list = storeName.replace(keyword, "_" + this.props.nowKeyWords + "_").split("_")
		for (let child of list) {
			if (child == keyword) {
				customList.push(<Text style={{ color: '#1FBBF7' }}>{child}</Text>)
			} else {
				customList.push(<Text >{child}</Text>)
			}
		}
		return customList
	}

	public render() {
		return (
			<View style={{ backgroundColor: 'white' }} >
				<TouchableOpacity onPress={this.onPress} style={{ display: "flex", margin: 10 }}>
					<Text style={{ fontSize: 16, color: '#404040' }}>
						{this.onCheckStoreName(this.props.item.storeName)}
						（代码：{this.props.item.storeCode}）
					</Text>
					<View style={{ alignItems: "center", marginTop: 10, flexDirection: "row" }}>
						<Image source={require('../../assets/images/img_location_30x30.png')} style={{ height: 15, width: 15 }} />
						<Text style={{ marginLeft: 3, color: '#404040', flex: 1 }}>{this.onCheckStoreName(this.props.item.address)}</Text>
					</View>
				</TouchableOpacity>
				<View style={{ backgroundColor: '#F1F1F1', height: 1, marginLeft: 10 }} />
			</View>
		);
	}
}


interface StateProps {
	openedStores?: Array<OpenedStore>
}

interface DispatchProps {
	fetchAllOpenedStores: FetchAllOpenedStoresActionFunction
}

interface OwnProps {
	navigation: NavigationScreenProp<NavigationRoute>
}

interface OwnState {
	searchedOpenStores: Array<OpenedStore>
	isSearchingIndicatorVisible: boolean,
	nowKeyword?: string
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = state => ({
	openedStores: state.get('openedStores').get('data')
})
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>) => ({
	fetchAllOpenedStores: () => dispatch(fetchAllOpenedStores())
})
class MapSearch extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {
	static navigationOptions = {
		header: () => false,
		headerBackTitle: null,
	}

	constructor(props: StateProps & DispatchProps & OwnProps) {
		super(props)

		this.state = {
			isSearchingIndicatorVisible: false,
			searchedOpenStores: new Array<OpenedStore>(),
			nowKeyword: ""
		}
	}

	private filterOpenedStore?: (keyword: string) => {}

	componentDidMount() {
		this.props.fetchAllOpenedStores()
	}

	private exitCurrentPage = () => {
		this.props.navigation.goBack()
	}

	private filterOpenedStores = (keyword: string) => {
		this.setState({
			nowKeyword: keyword
		})
		return this.props.openedStores!.filter(openedStore => {
			return openedStore.storeName.indexOf(keyword) !== -1 || openedStore.storeCode.indexOf(keyword) !== -1 || openedStore.address.indexOf(keyword) !== -1
		})
	}

	private onChangeText = (text: string) => {
		if (!this.props.openedStores) return
		if (!this.filterOpenedStore) {
			this.filterOpenedStore = throttle((text: string) => {
				return this.filterOpenedStores(text)
			}, 100, {
					trailing: false
				})
		}
		this.setState({ isSearchingIndicatorVisible: true })
		const searchedOpenStores = this.filterOpenedStore(text) as Array<OpenedStore>
		this.setState({ searchedOpenStores, isSearchingIndicatorVisible: false })
	}

	private onStoreItemPress = (openedStore: OpenedStore) => {
		Keyboard.dismiss()
		this.props.navigation.state.params && this.props.navigation.state.params.onOpenedStoreSelected && this.props.navigation.state.params.onOpenedStoreSelected(openedStore)
		this.props.navigation.goBack()
	}

	private renderItem = ({ item }: { item: any }) => (<StoreItemComponent onPress={this.onStoreItemPress} item={item} nowKeyWords={this.state.nowKeyword} />)

	private keyExtractor = (item: OpenedStore) => `${item.storeCode}`

	render() {
		return (
			<View style={{ backgroundColor: "#f5f5f5", display: 'flex', flexDirection: "column", flex: 1 }}>
				<View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, paddingTop: 10 + statusBarHeight, backgroundColor: "white" }} >
					<TouchableOpacity onPress={this.exitCurrentPage} style={{ height: 40, width: 30, justifyContent: 'center' }} >
						<Image source={require('../../assets/images/img_back_60x60.png')} />
					</TouchableOpacity>
					<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', marginLeft: 5, borderRadius: 2, borderColor: "rgba(0,0,0,0.1)", borderWidth: 1, height: 40 }} >
						<Image source={require('../../assets/images/img_search_36x36.png')} style={{ marginLeft: 5, marginRight: 5 }} />
						<TextInput autoFocus returnKeyType='search' onChangeText={this.onChangeText} placeholder='门店地址/门店名称/门店代码' style={{ height: 40, flex: 1 }} />
						{
							this.state.isSearchingIndicatorVisible ?
								(<ActivityIndicator animating={true} hidesWhenStopped={true} style={{ marginRight: 5 }} />) :
								null
						}
					</View>
				</View>
				<FlatList
					data={this.state.searchedOpenStores}
					renderItem={this.renderItem}
					keyExtractor={this.keyExtractor}
					style={{ marginTop: 5, flex: 1 }}
					onScrollBeginDrag={Keyboard.dismiss}
				/>
			</View>
		)
	}
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(MapSearch)
