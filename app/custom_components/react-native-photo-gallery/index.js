import { ActivityIndicator, Dimensions, FlatList, View } from "react-native";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Pagination } from "./src";
import Slide from './src/Slide'

export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this.sendCurrentImageInfo(this.props.data[0]);
    this.state = {
      index: 0,
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height
    };
    if (this.props.initialIndex) {
      setTimeout(() => {
        this.goTo(this.props.initialIndex);
      }, 100);
    }
  }

  UNSAFE_componentWillMount() {
    if(Dimensions.get("window").width < Dimensions.get("window").height) {
        this.setState({
            is_portrait: true,
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height
        })
    } else {
        this.setState({
            is_portrait: false,
            width: Dimensions.get("window").height,
            height: Dimensions.get("window").width
        })
    }
    Dimensions.addEventListener("change", () => {
      console.log(Dimensions.get("window").width + "    " + Dimensions.get("window").height)
        if(Dimensions.get("window").width < Dimensions.get("window").height) {
            this.setState({
                is_portrait: true,
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height
            })
        } else {
            this.setState({
                is_portrait: false,
                width: Dimensions.get("window").height,
                height: Dimensions.get("window").width
            })
        }
    })
  }

  sendCurrentImageInfo = image => {
    if (this.props.setCurrentImage) this.props.setCurrentImage(image);
  };

  onScrollEnd = e => {
    const contentOffset = e.nativeEvent.contentOffset;
    const viewSize = e.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    if (pageNum !== this.state.index) {
      this.setState({ index: pageNum });
    }
  };

  getItemLayout = (data, index) => {
    const { width } = this.state;
    return {
      length: this.state.width,
      offset: this.state.width * index,
      index
    };
  };

  goTo = index => {
    this.sendCurrentImageInfo(this.props.data[index]);
    this.setState({ index });
    this.swiper.scrollToOffset({
      animated: true,
      offset: this.state.width * index
    });
  };

  _renderImage = (item) => {
    return (
      <Slide item = {item} />
    )
  };

  render() {
    const backgroundColor = this.props.backgroundColor || "#000";
    const data = this.props.data || [];
    return (
      <View
        onLayout={this.onLayout}
        style={{
          ...styles.container,
          backgroundColor
        }}
      >
        {!data.length && <ActivityIndicator style={{position: "absolute", top: this.state.height / 2 - 10, left: this.state.width / 2 - 10}} />}
        <FlatList
          onLayout={this.onLayout}
          style={[styles.flatList, {height: '100%', width: '100%'}]}
          data={data}
          extraData={this.state}
          horizontal
          initialNumToRender={this.props.initialNumToRender || 4}
          ref={(ref) => this.swiper = ref}
          pagingEnabled
          onMomentumScrollEnd={this.onScrollEnd}
          getItemLayout={this.getItemLayout}
          renderItem={img => <Slide {...img} />}
          keyExtractor={item => item.id}
        />

        <Pagination
          index={this.state.index}
          data={data}
          initialPaginationSize={this.props.initialPaginationSize || 10}
          goTo={this.goTo}
          backgroundColor={backgroundColor}
        />
      </View>
    );
  }
}

Gallery.propTypes = {
  backgroundColor: PropTypes.string,
  data: PropTypes.arrayOf((propValue, key) => {
    if (!propValue[key].id || !propValue[key].image) {
      return new Error(
        'Data prop is invalid. It must be an object containing "id" and "image" keys.'
      );
    }
  }),
  setCurrentImage: PropTypes.func
};

const styles = {
  container: {
    flex: 1,
    flexDirection: "column",
    // justifyContent: "space-between",
    width: '100%',
    height: '100%'
  },
  flatList: {
    flex: 1,
    // width: this.state.width,
    alignSelf: "stretch",
    // backgroundColor: '#000'
  },
  // loader: {
  //   position: "absolute",
  //   top: this.state.height / 2 - 10,
  //   left: this.state.width / 2 - 10
  // }
};
