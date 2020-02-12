import React from 'react';
import PropTypes from 'prop-types';
import {
	FlatList, Text, View, StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import RNUserDefaults from 'rn-user-defaults';

// import I18n from '../i18n';
import { themedHeader } from '../utils/navigation';
import { withTheme } from '../theme';
import { themes } from '../constants/colors';
import sharedStyles from './Styles';
import StatusBar from '../containers/StatusBar';
import Separator from '../containers/Separator';
import ListItem from '../containers/ListItem';
import { CustomIcon } from '../lib/Icons';
import { URL_PREFERENCES_KEY } from '../lib/rocketchat';

const THEMES = [
	{
		label: 'Open links in browser',
		value: 'browser'
	}, {
		label: 'Open links in webview',
		value: 'webview'

	}
];

const styles = StyleSheet.create({
	list: {
		paddingBottom: 18
	},
	info: {
		paddingTop: 25,
		paddingBottom: 18,
		paddingHorizontal: 16
	},
	infoText: {
		fontSize: 16,
		...sharedStyles.textRegular
	}
});

class UrlView extends React.Component {
	static navigationOptions = ({ screenProps }) => ({
		title: 'Url Settings',
		...themedHeader(screenProps.theme)
	})

	static propTypes = {
		theme: PropTypes.string
	}

	// state = {
	// 	val: null
	// }

	// async componentDidMount() {
	// 	const val = await RNUserDefaults.get(URL_PREFERENCES_KEY);
	// 	this.setState({ val });
	// }

	isSelected = (item) => {
		const { val } = this.state;
		if (item.value === val) {
			return true;
		}
		return false;
	}

	onClick = async(item) => {
		const { value } = item;
		await RNUserDefaults.set(URL_PREFERENCES_KEY, value);
		this.setState({ val: value });
	}

	renderSeparator = () => {
		const { theme } = this.props;
		return <Separator theme={theme} />;
	}

	renderIcon = () => {
		const { theme } = this.props;
		return <CustomIcon name='check' size={20} color={themes[theme].tintColor} />;
	}

	renderItem = ({ item, index }) => {
		const { theme } = this.props;
		const { label, value } = item;
		const isFirst = index === 0;
		return (
			<>
				{item.separator || isFirst ? this.renderSectionHeader(item.header) : null}
				<ListItem
					title={label}
					onPress={() => this.onClick(item)}
					testID={`theme-view-${ value }`}
					right={this.isSelected(item) ? this.renderIcon : null}
					theme={theme}
				/>
			</>
		);
	}

	renderSectionHeader = (header = 'Url Setting') => {
		const { theme } = this.props;
		return (
			<>
				<View style={styles.info}>
					<Text style={[styles.infoText, { color: themes[theme].infoText }]}>{header}</Text>
				</View>
				{this.renderSeparator()}
			</>
		);
	}

	renderFooter = () => {
		const { theme } = this.props;
		return (
			<View style={[styles.info, sharedStyles.separatorTop, { borderColor: themes[theme].separatorColor }]}>
				<Text style={{ color: themes[theme].infoText }}>
					Change the preferences to open the links in browser or webview.
				</Text>
			</View>
		);
	}

	render() {
		const { theme } = this.props;
		return (
			<SafeAreaView
				style={[sharedStyles.container, { backgroundColor: themes[theme].auxiliaryBackground }]}
				forceInset={{ vertical: 'never' }}
			>
				<StatusBar theme={theme} />
				<FlatList
					data={THEMES}
					keyExtractor={item => item.value}
					contentContainerStyle={[
						styles.list,
						{ borderColor: themes[theme].separatorColor }
					]}
					renderItem={this.renderItem}
					ListHeaderComponent={this.renderHeader}
					ListFooterComponent={this.renderFooter}
					ItemSeparatorComponent={this.renderSeparator}
				/>
			</SafeAreaView>
		);
	}
}

export default withTheme(UrlView);
