import React, { Component } from 'react';
import { Container, Content, Text, StyleProvider, Left, Title, Button, Header, List, ListItem, Separator, Icon, Body, View, Fab, Right } from 'native-base';
import { CheckBox } from 'react-native-elements'
import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';
import materialDark from './native-base-theme/variables/material-dark';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class MainScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: false,
            date: new Date()
        }
    }

    convert2Month(data) {
        let a = new Date(data);
        const month = [];
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        return month[a.getMonth()] + ", " + a.getFullYear();
    }

    getMonthSpending(k) {
        let re = {
            "spend": 0,
            "income": 0
        }
        let toCompare = this.convert2Month(k);
        for (let i of Object.keys(this.props.data)) {
            if (this.convert2Month(i).localeCompare(toCompare) === 0) {
                for (let k of this.props.data[i]) {
                    k.Income ?
                        re.income += k.Amount :
                        re.spend += k.Amount;
                }
            }
        }
        return re;
    }

    deletion(id) {
        if (this.props.deletion.indexOf(id) === -1) {
            let tmp = this.props.deletion;
            tmp.push(id);
            this.props.setDeletion(tmp);
        } else {
            let tmp = this.props.deletion;
            tmp.splice(tmp.indexOf(id), 1);
            if (tmp.length > 0) {
                this.props.setDeletion(tmp);
            }
            else {
                this.props.setDeletion(tmp);
            }
        }
        //console.log(this.state.deletion);
    }


    getItems() {
        let re = [];
        let last = "";
        let id = 0;
        for (let i of Object.keys(this.props.data)) {
            if (last.localeCompare(this.convert2Month(i)) !== 0) {
                last = i;
                let spending = this.getMonthSpending(i);
                let subtotal = spending.income - spending.spend;
                re.push(
                    <ListItem itemDivider key={i}>
                        <Left><Text>{this.convert2Month(i)}</Text></Left>
                        <Right><Text><Text style={{ color: 'green' }}>{"-" + spending.spend + "  "}</Text><Text style={{ color: 'red' }}>{"+" + spending.income}</Text>
                        </Text></Right>
                    </ListItem>);
            }
            for (let k of Object.values(this.props.data[i])) {
                re.push(
                    <ListItem noIndent thumbnail key={id++} button onPress={() => {
                        if (this.props.delete) {
                            this.deletion(k.id)
                        } else {
                            this.props.changeIDtemp(k.id);
                            this.props.changeTemp("title", k.Title);
                            this.props.changeTemp("income", k.Income ? "Income" : "Expense");
                            this.props.changeTemp("category", k.Category);
                            this.props.changeTemp('date', i);
                            this.props.changeTemp("amount", k.Amount)
                            this.props.changeTemp("description", k.Description);
                            this.props.navigation.navigate("Edit")
                        }
                    }} onLongPress={() => {
                        if (!this.props.delete) {
                            initialize = true;
                            this.deletion(k.id);
                        }
                    }}>
                        {this.props.delete ? (
                            <Left style={{ marginLeft: -20, marginRight: -20 }}><CheckBox checked={this.props.deletion.indexOf(k.id) !== -1} onPress={() => { this.deletion(k.id) }} /></Left>
                        ) : <Left style={{ marginLeft: -20 }}></Left>}
                        <Body >
                            <Text>{this.truncate(k.Title) + "  "}<Text style={k.Income ? { color: 'red' } : { color: 'green' }}>{(k.Income ? "+" : "-") + k.Amount}</Text></Text>
                            <Text note>{this.truncateContent(k.Description)}</Text>
                        </Body>
                        <Right><Icon name="arrow-forward" /></Right>
                    </ListItem>
                );
            }
        }
        return re;
    }

    truncate(string) {
        let a = parseInt(Dimensions.get('window').width / 15.68);
        return string.length > a ? string.substring(0, a - 3) + "..." : string;
    }

    truncateContent(string) {
        let a = parseInt(Dimensions.get('window').width / 8.5);
        return string.length > a ? string.substring(0, a - 3) + "..." : string;
    }

    render() {
        return (

            <Container>
                <Content>
                    <List>
                        {this.getItems()}
                    </List>
                </Content>

                <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{}}
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => this.setState({ active: !this.state.active })}>
                    <Icon type="MaterialIcons" name='add' />
                    <Button style={{ backgroundColor: '#34A34F' }} onPress={() => { this.props.navigation.navigate("Add") }}>
                        <Icon type="MaterialIcons" name='note' />
                    </Button>
                    <Button style={{ backgroundColor: '#3B5998' }} onPress={() => { this.props.navigation.navigate("Chat") }}>
                        <Icon type="MaterialIcons" name='mic-none' />
                    </Button>
                    <Button disabled style={{ backgroundColor: '#DD5144' }}>
                        <Icon type="MaterialIcons" name='camera-alt' />
                    </Button>
                </Fab>
            </Container>

        );
    }

}