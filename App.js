import React, { Component } from 'react';
import { Container, Content, Text, StyleProvider, H1, H2, Left, Title, Button, Header, List, ListItem, Separator, Icon, Body, View, Fab, Right, Tab, Tabs, ScrollableTab } from 'native-base';
import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';
import materialDark from './native-base-theme/variables/material-dark';
import { AppearanceProvider, Appearance, useColorScheme } from 'react-native-appearance';

import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';
import * as Font from 'expo-font';
import MainTab from './MainTab';
import Ordering from './Ordering';
import Home from './Home';
import Add from './Add';
import Edit from './Edit'
import Chat from './Chat'
import { createStackNavigator } from '@react-navigation/stack';
import {
  NavigationContainer
} from '@react-navigation/native';
import Website from './Website'

var tempObj = {};
var idRange = 0;
var idTemp = 0;
var origDate = "";

class MainScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      category: {},
      loading: true,
      delete: false,
      deletion: [],
      theme: "dark"
    }
    this.storeData = this.storeData.bind(this);
    this.getData = this.getData.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleEditItem = this.handleEditItem.bind(this)
    this.getOtherTabs = this.getOtherTabs.bind(this);
    this.handleModifyCategory = this.handleModifyCategory.bind(this);
    this.changeTemp = this.changeTemp.bind(this);
    this.changeIDtemp = this.changeIDtemp.bind(this);
    this.cleanTemp = this.cleanTemp.bind(this)
    this.setDeletion = this.setDeletion.bind(this)
    this.handleDeletion = this.handleDeletion.bind(this)
    this.subscription = Appearance.addChangeListener(({ colorScheme }) => {
      //console.log(colorScheme);
      this.setState({ theme: colorScheme })
    });
  }


  changeTemp(key, value) {
    tempObj[key] = value;
    //console.log(tempObj);
    if (key.localeCompare("date") === 0 && origDate.localeCompare("") === 0) {
      //console.log(typeof value)
      origDate = new Date(value).toLocaleDateString()
    }
  }

  changeIDtemp(value) {
    idTemp = value;
  }

  setDeletion(value) {
    if (value.length !== 0) this.setState({ delete: true, deletion: value })
    else this.setState({ delete: false, deletion: value })
  }

  componentWillUnmount() {
    this.cleanTemp();
  }

  cleanTemp() {
    tempObj = {};
    idTemp = 0;
    origDate = "";
  }

  async storeData(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) { // saving error
    }
  }

  async getData(key) {
    try {
      const value = await AsyncStorage.getItem(key)
      return JSON.parse(value);
    } catch (e) { // error reading value
    }
  }

  async initialize() {
    //await AsyncStorage.removeItem("category");
    //await AsyncStorage.removeItem("data");
    let cat = await this.getData("category");
    if (cat === null) {//no item, do initialize
      let categories = {
        "Income": ["Salary"],
        "Expense": ["Normal", "Emergent"]
      };
      this.setState({
        category: categories
      });
      await this.storeData("category", categories);
    } else {
      this.setState({
        category: cat
      });
    }

    let dat = await this.getData("data");
    if (dat === null) {
      let time = new Date().toLocaleDateString();
      let data = {};
      data[time] = [
        {
          "id": 1,
          "Amount": 0,
          "Income": true,
          "Category": "Salary",
          "Title": "Initial Salary",
          "Description": "Here is your initial salary, it is just a sample"
        },
        {
          "id": 2,
          "Amount": 0,
          "Income": false,
          "Category": "Normal",
          "Title": "Initial Expense",
          "Description": "Here is your initial Expense, it is just a sample"
        },
        {
          "id": 3,
          "Amount": 0,
          "Income": false,
          "Category": "Emergent",
          "Title": "Initial Expense Emergent",
          "Description": "Here is your initial Expense, it is just a sample"
        }
      ];

      // console.log(data);
      this.setState({
        data: data
      });
      await this.storeData("data", data);
    } else {
      this.setState({
        data: dat
      });
    }

    for (let i of Object.keys(this.state.data)) {
      for (let k of this.state.data[i]) {
        if (k.id > idRange) idRange = k.id;
      }
    }
  }

  async handleModifyCategory(categories) {
    this.setState({
      category: categories
    });
    await this.storeData("category", categories);
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    })
    await this.initialize();
    this.setState({ theme: Appearance.getColorScheme() });

    this.setState({ loading: false })

  }


  async handleAddItem(navigation) {

    if (Object.keys(tempObj).length < 6) {
      Alert.alert("Please fill all fields");
      return;
    }
    navigation.goBack();
    let a = tempObj.date.toLocaleDateString();

    let temp = this.state.data;
    if (temp[a] === undefined) {
      temp[a] = [];
    }
    let newElement = {};
    idRange++;
    newElement["id"] = idRange;
    newElement["Amount"] = tempObj.amount;
    newElement["Income"] = tempObj.income.localeCompare("Income") === 0 ? true : false;
    newElement["Category"] = tempObj.category;
    newElement["Title"] = tempObj.title;
    newElement["Description"] = tempObj.description;
    temp[a].push(newElement);
    //console.log(temp[a]);
    this.setState({ data: temp });
    await this.storeData("data", temp);

    this.cleanTemp();
    //console.log(tempObj);
  }

  async handleEditItem(navigation) {
    //console.log(tempObj)
    // for()

    if (Object.keys(tempObj).length < 6) {
      Alert.alert("Please fill all fields");
      return;
    }
    navigation.goBack();
    let a = tempObj.date.toLocaleDateString();

    let temp = this.state.data;
    if (temp[a] === undefined) {//in a new date
      temp[a] = [];
      let newElement = {};
      newElement["id"] = idTemp;
      newElement["Amount"] = tempObj.amount;
      newElement["Income"] = tempObj.income.localeCompare("Income") === 0 ? true : false;
      newElement["Category"] = tempObj.category;
      newElement["Title"] = tempObj.title;
      newElement["Description"] = tempObj.description;
      temp[a].push(newElement);
      //deletion start
      let obj = [];
      for (let i of temp[origDate]) {
        if (i.id !== idTemp) obj.push(i)
      }
      temp[origDate] = obj;

    } else {
      let newElement = {};
      for (let i of temp[a]) {
        if (i.id === idTemp) {
          newElement = i;
          break;
        }
      }
      newElement["Amount"] = tempObj.amount;
      newElement["Income"] = tempObj.income.localeCompare("Income") === 0 ? true : false;
      newElement["Category"] = tempObj.category;
      newElement["Title"] = tempObj.title;
      newElement["Description"] = tempObj.description;
    }
    //console.log(temp);
    this.setState({ data: temp });
    await this.storeData("data", temp);

    this.cleanTemp();

  }

  async handleDeletion() {
    let temp = this.state.data;
    for (let i of this.state.deletion) {
      temp = this.singleDelete(temp, i)
    }
    this.cleanTemp()
    this.setState({ data: temp, delete: false, deletion: [] })
    await this.storeData("data", temp);
    console.log(temp)
  }

  singleDelete(temp, id) {
    for (let k of Object.keys(temp)) {
      let obj = [];
      for (let i of temp[k]) {
        if (i.id !== id) { obj.push(i) }
      }
      temp[k] = obj;
    }
    return temp;
  }

  getOtherTabs(props) {
    let tabs = [];
    for (let i of Object.values(this.state.category.Income)) {
      //console.log(i);
      tabs.push(
        <Tab heading={i} key={i} tabStyle={{ backgroundColor: this.state.theme === 'dark' ? "#081623" : "#2b82c9" }} activeTabStyle={{ backgroundColor: this.state.theme === 'dark' ? "#081623" : "#2b82c9" }}>
          <MainTab {...props} category={i} delete={this.state.delete} deletion={this.state.deletion} data={this.state.data} setDeletion={this.setDeletion} changeTemp={this.changeTemp} changeIDtemp={this.changeIDtemp} />
        </Tab>
      );
    }
    for (let i of Object.values(this.state.category.Expense)) {
      //console.log(i);
      tabs.push(
        <Tab heading={i} key={i} tabStyle={{ backgroundColor: this.state.theme === 'dark' ? "#081623" : "#2b82c9" }} activeTabStyle={{ backgroundColor: this.state.theme === 'dark' ? "#081623" : "#2b82c9" }}>
          <MainTab {...props} category={i} data={this.state.data} delete={this.state.delete} deletion={this.state.deletion} setDeletion={this.setDeletion} changeTemp={this.changeTemp} changeIDtemp={this.changeIDtemp} />
        </Tab>
      );
    }
    return tabs;
  }

  render() {
    //console.log("aaa")
    if (this.state.loading) {
      return (
        <View></View>
      );
    }
    return (
      <StyleProvider style={getTheme(this.state.theme === 'dark' ? materialDark : material)}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Organize" screenOptions={{
            headerStyle: {
              backgroundColor: '#2b82c9',
            },
            headerTintColor: '#fff'
          }}>
            <Stack.Screen name="Organize" options={{ header: (props) => <CustomHeader {...props} data="normal" functions={this.handleDeletion} cleanTemp={this.cleanTemp} deletion={this.state.deletion} /> }}>
              {(props) =>
                <StyleProvider style={getTheme(this.state.theme === 'dark' ? materialDark : material)}>
                  <Container>
                    <Tabs renderTabBar={() => <ScrollableTab style={{ height: '6%' }} />} initialPage={1} >
                      <Tab heading="Order" tabStyle={{ backgroundColor: this.state.theme === 'dark' ? "#081623" : "#2b82c9" }} activeTabStyle={{ backgroundColor: this.state.theme === 'dark' ? "#081623" : "#2b82c9" }}>
                        <Ordering {...props} data={this.state.data} category={this.state.category} handleModifyCategory={this.handleModifyCategory} />
                      </Tab>
                      <Tab heading="Home" tabStyle={{ backgroundColor: this.state.theme === 'dark' ? "#081623" : "#2b82c9" }} activeTabStyle={{ backgroundColor: this.state.theme === 'dark' ? "#081623" : "#2b82c9" }}>
                        <Home {...props} data={this.state.data} delete={this.state.delete} deletion={this.state.deletion} setDeletion={this.setDeletion} changeTemp={this.changeTemp} changeIDtemp={this.changeIDtemp} />
                      </Tab>
                      {this.getOtherTabs(props)}
                    </Tabs>
                  </Container>
                </StyleProvider>
              }
            </Stack.Screen>
            <Stack.Screen name="Add" options={{ header: (props) => <CustomHeader {...props} data="Add" functions={this.handleAddItem} cleanTemp={this.cleanTemp} /> }}>
              {(props) =>
                <StyleProvider style={getTheme(this.state.theme === 'dark' ? materialDark : material)}>

                  <Add {...props} data={this.state.data} changeTemp={this.changeTemp} category={this.state.category} />
                </StyleProvider>}
            </Stack.Screen>
            <Stack.Screen name="Website" options={{ header: (props) => <CustomHeader {...props} data="website" />, title: "Yearly Budgeting Tool" }}>
              {(props) =>
                <StyleProvider style={getTheme(this.state.theme === 'dark' ? materialDark : material)}>
                  <Website {...props} data={this.state.data} category={this.state.category} />
                </StyleProvider>
              }
            </Stack.Screen>
            <Stack.Screen name="Edit" options={{ header: (props) => <CustomHeader {...props} data="Add" functions={this.handleEditItem} cleanTemp={this.cleanTemp} /> }}>
              {(props) =>
                <StyleProvider style={getTheme(this.state.theme === 'dark' ? materialDark : material)}>

                  <Edit {...props} data={tempObj} changeTemp={this.changeTemp} category={this.state.category} />
                </StyleProvider>}
            </Stack.Screen>
            <Stack.Screen name="Chat" options={{ header: (props) => <CustomHeader {...props} data="Chat" functions={this.handleEditItem} cleanTemp={this.cleanTemp} /> }}>
              {(props) =>
                <StyleProvider style={getTheme(this.state.theme === 'dark' ? materialDark : material)}>

                  <Chat {...props} data={tempObj} changeTemp={this.changeTemp} category={this.state.category} />
                </StyleProvider>}
            </Stack.Screen>


          </Stack.Navigator>

        </NavigationContainer>
      </StyleProvider>
    );
  }

}

const CustomHeader = ({ scene, previous, navigation, data, functions, cleanTemp, deletion }) => {
  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
        ? options.title
        : scene.route.name;

  let rightSide = null;
  if (data.localeCompare("Add") === 0) {

    return (
      <Header>
        {previous ? (
          <Left><Button transparent onPress={() => {
            navigation.goBack();
            cleanTemp();
          }}>
            <Icon name="arrow-back" />
          </Button></Left>
        ) : <View style={{ paddingLeft: 10 }}></View>}

        <Body><Title>{title}</Title></Body>
        <Right><Button transparent iconLeft onPress={() => { functions(navigation); }}><Icon type="MaterialIcons" name='save' /><Text>{"Save"}</Text></Button></Right>
      </Header>
    );
  }

  if (data.localeCompare("Chat") === 0) {

    return (
      <Header>
        {previous ? (
          <Left><Button transparent onPress={() => {
            navigation.goBack();
            cleanTemp();
          }}>
            <Icon name="arrow-back" />
          </Button></Left>
        ) : <View style={{ paddingLeft: 10 }}></View>}

        <Body><Title>{title}</Title></Body>
        <Right></Right>
      </Header>
    );
  }

  if (data.localeCompare("normal") === 0) {

    return (
      <Header>
        {previous ? (
          <Left><Button transparent onPress={() => {
            navigation.goBack();
            cleanTemp();
          }}>
            <Icon name="arrow-back" />
          </Button></Left>
        ) : <View style={{ paddingLeft: 10 }}></View>}

        <Body><Title>{title}</Title></Body>
        {deletion.length === 0 ? <Right><Button transparent iconLeft onPress={() => { navigation.navigate("Website") }}><Icon type="MaterialIcons" name='cloud-upload' /></Button></Right>
          : <Right><Button transparent iconLeft onPress={() => { functions() }}><Icon type="MaterialIcons" name='delete' /></Button></Right>
        }

      </Header>
    );
  }

  return (
    <Header>
      {previous ? (
        <Left><Button transparent onPress={navigation.goBack}>
          <Icon name="arrow-back" />
        </Button></Left>
      ) : <View style={{ paddingLeft: 10 }}></View>}

      <Body><Title>{title}</Title></Body>
      <Right></Right>
    </Header>
  );
};


const Stack = createStackNavigator();

export default function App() {
  return (
    <AppearanceProvider>
      <MainScreen />
    </AppearanceProvider>
  );
}
