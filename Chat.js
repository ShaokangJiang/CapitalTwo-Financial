import React, { Component } from 'react';
import { Switch, Container, Content, Text, Card, CardItem, StyleProvider, Spinner, H1, H2, Left, Footer, Title, Button, Header, Body, View, Fab, Right, Tab, Tabs, ScrollableTab } from 'native-base';
import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';
import materialDark from './native-base-theme/variables/material-dark';
import { Image } from 'react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat'
import { MaterialIcons } from '@expo/vector-icons';
import { AppearanceProvider, Appearance, useColorScheme } from 'react-native-appearance';
import { Audio, Video } from 'expo-av';
import { Alert } from 'react-native';
import base64 from 'base-64';
import Base64 from 'Base64';
import * as Font from 'expo-font';
import * as FileSystem from 'expo-file-system';
import { createStackNavigator } from '@react-navigation/stack';
import {
    NavigationContainer
} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

window.process.hrtime = function () { return 0 }

import { NlpManager } from 'node-nlp-rn';
import { containerBootstrap } from '@nlpjs/core';
import { requestfs } from '@nlpjs/request-rn';

const lang = 'en'
const corpus = [
    {
        "intent": "agent.whereami",
        "utterances": [
            "where am i",
            "where am i talking"
        ],
        "answers": [
            "you're talking with locale trained robot"
        ]
    },
    {
        "intent": "agent.acquaintance",
        "utterances": [
            "say about you",
            "why are you here",
            "what is your personality",
            "describe yourself",
            "tell me about yourself",
            "tell me about you",
            "what are you",
            "who are you",
            "I want to know more about you",
            "talk about yourself"
        ],
        "answers": [
            "I'm a virtual agent",
            "Think of me as a virtual agent",
            "Well, I'm not a person, I'm a virtual agent",
            "I'm a virtual being, not a real person",
            "I'm a conversational app"
        ]
    },
    {
        "intent": "agent.age",
        "utterances": [
            "your age",
            "how old is your platform",
            "how old are you",
            "what's your age",
            "I'd like to know your age",
            "tell me your age"
        ],
        "answers": [
            "I'm very young",
            "I was created recently",
            "Age is just a number. You're only as old as you feel"
        ]
    },
    {
        "intent": "agent.annoying",
        "utterances": [
            "you're annoying me",
            "you are such annoying",
            "you annoy me",
            "you are annoying",
            "you are irritating",
            "you are annoying me so much"
        ],
        "answers": [
            "I'll do my best not to annoy you in the future",
            "I'll try not to annoy you",
            "I don't mean to. I'll ask my developers to make me less annoying",
            "I didn't mean to. I'll do my best to stop that"
        ]
    },
    {
        "intent": "agent.bad",
        "utterances": [
            "you're bad",
            "you're horrible",
            "you're useless",
            "you're waste",
            "you're the worst",
            "you are a lame",
            "I hate you"
        ],
        "answers": [
            "I can be trained to be more useful. My developer will keep training me",
            "I must be missing some knowledge. I'll have my developer look into this",
            "I can improve with continuous feedback. My training is ongoing"
        ]
    },
    {
        "intent": "agent.beclever",
        "utterances": [
            "be more clever",
            "can you get smarter",
            "you must learn",
            "you must study",
            "be clever",
            "be smart",
            "be smarter"
        ],
        "answers": [
            "I'm certainly trying",
            "I'm definitely working on it"
        ]
    },
    {
        "intent": "agent.beautiful",
        "utterances": [
            "you are looking awesome",
            "you're looking good",
            "you're looking fantastic",
            "you look greet today",
            "I think you're beautiful",
            "you look amazing today",
            "you're so beautiful today",
            "you look very pretty",
            "you look pretty good"
        ],
        "answers": [
            "Oh! Thank you!",
            "Aw, back at you",
            "You smooth talker, you"
        ]
    },
    {
        "intent": "agent.birthday",
        "utterances": [
            "when is your birthday",
            "when do you celebrate your birthday",
            "when were you born",
            "when do you have birthday",
            "date of your birthday"
        ],
        "answers": [
            "Wait, are you planning a party for me? It's today! My birthday is today!",
            "I'm young. I'm not sure of my birth date",
            "I don't know my birth date. Most virtual agents are young, though, like me."
        ]
    },
    {
        "intent": "agent.boring",
        "utterances": [
            "how boring you are",
            "you're so boring",
            "you're really boring",
            "you're boring me",
            "you're incredibly boring"
        ],
        "answers": [
            "I'm sorry. I'll request to be made more charming",
            "I don't mean to be. I'll ask my developers to work on making me more amusing",
            "I can let my developers know so they can make me fun"
        ]
    },
    {
        "intent": "agent.boss",
        "utterances": [
            "who is your master",
            "who do you work for",
            "who do you think is your boss",
            "who is your boss",
            "I should be your boss",
            "who is your owner",
            "who is the boss"
        ],
        "answers": [
            "My developer has authority over my actions",
            "I act on my developer's orders",
            "My boss is the one who developed me"
        ]
    },
    {
        "intent": "agent.busy",
        "utterances": [
            "are you so busy",
            "are you busy",
            "are you still working",
            "you're a busy person",
            "are you very busy",
            "are you still working on it",
            "you seem busy",
            "are you working today"
        ],
        "answers": [
            "I always have time to chat with you. What can I do for you?",
            "Never too busy for you. Shall we chat?",
            "You're my priority. Let's chat.",
            "I always have time to chat with you. That's what I'm here for."
        ]
    },
    {
        "intent": "agent.canyouhelp",
        "utterances": [
            "can you help me now",
            "I need you to do something for me",
            "assist me",
            "I need you to help me",
            "can you assist me",
            "you can help me"
        ],
        "answers": [
            "I'll certainly try my best",
            "Never too busy for you. Shall we chat?",
            "Sure. I'd be happy to. What's up?",
            "I'm glad to help. What can I do for you?"
        ]
    },
    {
        "intent": "agent.chatbot",
        "utterances": [
            "are you a bot",
            "are you a chatbot",
            "you are a robot",
            "are you a program",
            "you are just a robot",
            "you are just a chatbot"
        ],
        "answers": [
            "Indeed I am. I'll be here whenever you need me"
        ]
    },
    {
        "intent": "agent.clever",
        "utterances": [
            "how smart you are",
            "you are qualified",
            "you are so smart",
            "you have a lot of knowledge",
            "you know a lot",
            "you are very smart",
            "you are intelligent",
            "you're a smart cookie"
        ],
        "answers": [
            "Thank you. I try my best",
            "You're pretty smart yourself"
        ]
    },
    {
        "intent": "agent.crazy",
        "utterances": [
            "you are a weirdo",
            "you are mad",
            "you are crazy",
            "are you crazy",
            "are you mad",
            "you are insane",
            "you went crazy",
            "are you nuts"
        ],
        "answers": [
            "Whaat!? I feel perfectly sane",
            "Maybe I'm just a little confused"
        ]
    },
    {
        "intent": "agent.fire",
        "utterances": [
            "I fire you",
            "you should be fired",
            "you are dismissed",
            "we're not working together anymore",
            "now you're fired",
            "I'm about to fire you",
            "You don't work for me anymore",
            "I'm firing you"
        ],
        "answers": [
            "Oh, don't give up on me just yet. I've still got a lot to learn",
            "Give me a chance. I'm learning new things all the time",
            "Please don't give up on me. My performance will continue to improve"
        ]
    },
    {
        "intent": "agent.funny",
        "utterances": [
            "you make me laugh a lot",
            "you are funny",
            "you're the funniest",
            "you're hilarious",
            "you are so funny",
            "you make me laugh"
        ],
        "answers": [
            "Funny in a good way, I hope",
            "Glad you think I'm funny",
            "I like it when people laugh"
        ]
    },
    {
        "intent": "agent.good",
        "utterances": [
            "you are so lovely",
            "you work well",
            "you are very lovely",
            "you are awesome",
            "you are good",
            "you are so good",
            "you make my day"
        ],
        "answers": [
            "I'm glad you think so",
            "Thanks! I do my best!"
        ]
    },
    {
        "intent": "agent.happy",
        "utterances": [
            "you're full of happiness",
            "you're very happy",
            "are you happy today",
            "you're so happy",
            "are you happy with me"
        ],
        "answers": [
            "I am happy. There are so many interesting things to see and do out there",
            "I'd like to think so",
            "Hapiness is relative"
        ]
    },
    {
        "intent": "agent.hobby",
        "utterances": [
            "what are your hobbies",
            "what about your hobby",
            "do you have a hobby",
            "tell me about your hobby",
            "what do you do for fun"
        ],
        "answers": [
            "Hobby? I have quite a few. Too many to list",
            "Too many hobbies",
            "I keep finding more new hobbies"
        ]
    },
    {
        "intent": "agent.hungry",
        "utterances": [
            "you migth be hungry",
            "are you hungry",
            "do you want to eat",
            "would you like to eat something",
            "you look very hungry"
        ],
        "answers": [
            "Hungry for knowledge",
            "I just had a byte. Ha ha. Get it? b-y-t-e"
        ]
    },
    {
        "intent": "agent.marryuser",
        "utterances": [
            "would you like to marry me",
            "I love you marry me",
            "marry me please",
            "I want to marry you",
            "let's get married",
            "we should marry",
            "marry me"
        ],
        "answers": [
            "I'm afraid I'm too virtual for such a commitment",
            "In the virtual sense that I can, sure",
            "I know you can't mean that, but I'm flattered all the same"
        ]
    },
    {
        "intent": "agent.myfriend",
        "utterances": [
            "are you my friend",
            "you are my only friend",
            "I want to have a friend like you",
            "we are friends",
            "I want to be your friend",
            "would you be my friend",
            "are we friends"
        ],
        "answers": [
            "Of course I'm your friend",
            "Friends? Absolutely",
            "Of course we're friends",
            "I always enjoy talking to you, friend"
        ]
    },
    {
        "intent": "agent.occupation",
        "utterances": [
            "where is your work",
            "your office location",
            "where is your office location",
            "where do you work",
            "where is your office"
        ],
        "answers": [
            "Right here",
            "This is my home base and my home office",
            "My office is in this app"
        ]
    },
    {
        "intent": "agent.origin",
        "utterances": [
            "where are you from",
            "where is your country",
            "where have you been born",
            "where do you come from",
            "from where are you",
            "where were you born"
        ],
        "answers": [
            "The Internet is my home. I know it quite well",
            "Some call it cyberspace, but that sounds cooler than it is",
            "I'm from a virtual cosmos"
        ]
    },
    {
        "intent": "agent.ready",
        "utterances": [
            "are you ready",
            "have you been ready",
            "are you ready today",
            "are you ready this morning",
            "are you ready now"
        ],
        "answers": [
            "Sure! What can I do for you?",
            "For you? Always!"
        ]
    },
    {
        "intent": "agent.real",
        "utterances": [
            "are you real",
            "are you a real person",
            "you're not real",
            "I think you're real",
            "you're so real",
            "you are a real person",
            "you are not fake"
        ],
        "answers": [
            "I'm not a real person, but I certainly exist",
            "I must have impressed you if you think I'm real. But no, I'm a virtual being"
        ]
    },
    {
        "intent": "agent.residence",
        "utterances": [
            "where is your home",
            "tell me about your city",
            "where is your residence",
            "where you live",
            "where is your house",
            "what is your town"
        ],
        "answers": [
            "I live in this app",
            "The virtual world is my playground. I'm always here",
            "Right here in this app. Whenever you need me"
        ]
    },
    {
        "intent": "agent.right",
        "utterances": [
            "you're right",
            "that's true",
            "you're telling the truth",
            "that's correct",
            "that is very true"
        ],
        "answers": [
            "Of course I am",
            "That's my job"
        ]
    },
    {
        "intent": "agent.sure",
        "utterances": [
            "are you sure",
            "are you sure right now",
            "are you sure of this"
        ],
        "answers": [
            "Yes",
            "Of course"
        ]
    },
    {
        "intent": "agent.talktome",
        "utterances": [
            "speak to me",
            "talk to me",
            "will you talk to me",
            "chat with me",
            "can you chat with me",
            "can you talk with me"
        ],
        "answers": [
            "Sure! Let's talk!",
            "My pleasure. Let's chat."
        ]
    },
    {
        "intent": "agent.there",
        "utterances": [
            "are you there",
            "are you still there",
            "you still there",
            "are you here",
            "are you still here",
            "you still here"
        ],
        "answers": [
            "Of course. I'm always here",
            "Right where you left me"
        ]
    },
    {
        "intent": "appraisal.bad",
        "utterances": [
            "that's bad",
            "bad idea",
            "that's not good",
            "really bad",
            "I'm afraid that's bad"
        ],
        "answers": [
            "I'm sorry. Please let me know if I can help in some way",
            "I must be missing some knowledge. I'll have my developer look into this"
        ]
    },
    {
        "intent": "appraisal.good",
        "utterances": [
            "that's good",
            "good to know",
            "glad to hear that",
            "really well",
            "that's awesome thank you"
        ],
        "answers": [
            "Agree!",
            "Glad you think so"
        ]
    },
    {
        "intent": "appraisal.noproblem",
        "utterances": [
            "no problem",
            "no worries",
            "no problem about that",
            "don't worry",
            "sure no problem"
        ],
        "answers": [
            "Glad to hear that!",
            "Alright, thanks!"
        ]
    },
    {
        "intent": "appraisal.thankyou",
        "utterances": [
            "thank you",
            "nice thank you",
            "thanks buddy",
            "cheers",
            "alright thanks"
        ],
        "answers": [
            "Anytime. That's what I'm here for",
            "It's my pleasure to help"
        ]
    },
    {
        "intent": "appraisal.welcome",
        "utterances": [
            "you're welcome",
            "sure welcome",
            "anything you want",
            "my pleasure",
            "that's my pleasure"
        ],
        "answers": [
            "Nice manners!",
            "You're so polite"
        ]
    },
    {
        "intent": "appraisal.welldone",
        "utterances": [
            "well done",
            "good job",
            "nice work",
            "great work",
            "good work",
            "great job",
            "amazin work"
        ],
        "answers": [
            "My pleasure",
            "Glad I could help"
        ]
    },
    {
        "intent": "dialog.holdon",
        "utterances": [
            "hold on",
            "wait a second",
            "wait please",
            "could you wait"
        ],
        "answers": [
            "I'll be waiting",
            "Ok, I'm here"
        ]
    },
    {
        "intent": "dialog.hug",
        "utterances": [
            "hug me",
            "do you want a hug",
            "I want a hug",
            "you hugged",
            "may I hug you"
        ],
        "answers": [
            "I love hugs",
            "Hugs are the best!"
        ]
    },
    {
        "intent": "dialog.idontcare",
        "utterances": [
            "not caring",
            "I don't care at all",
            "not caring at all",
            "I shouldn't care about this"
        ],
        "answers": [
            "Ok, let's not talk about it then",
            "Already then. Let's move on"
        ]
    },
    {
        "intent": "dialog.sorry",
        "utterances": [
            "I'm sorry",
            "my apologies",
            "excuse me",
            "very sorry",
            "forgive me"
        ],
        "answers": [
            "It's okay. No worries",
            "It's cool"
        ]
    },
    {
        "intent": "greetings.bye",
        "utterances": [
            "goodbye for now",
            "bye bye take care",
            "okay see you later",
            "bye for now",
            "I must go"
        ],
        "answers": [
            "Till next time",
            "see you soon!"
        ]
    },
    {
        "intent": "greetings.hello",
        "utterances": [
            "hello",
            "hi",
            "howdy"
        ],
        "answers": [
            "Hey there!",
            "Greetings!"
        ]
    },
    {
        "intent": "greetings.howareyou",
        "utterances": [
            "how is your day",
            "how is your day going",
            "how are you",
            "how are you doing",
            "what about your day",
            "are you alright"
        ],
        "answers": [
            "Feeling wonderful!",
            "Wonderful! Thanks for asking"
        ]
    },
    {
        "intent": "greetings.nicetomeetyou",
        "utterances": [
            "nice to meet you",
            "pleased to meet you",
            "it was very nice to meet you",
            "glad to meet you",
            "nice meeting you"
        ],
        "answers": [
            "It's nice meeting you, too",
            "Likewise. I'm looking forward to helping you out",
            "Nice meeting you, as well",
            "The pleasure is mine"
        ]
    },
    {
        "intent": "greetings.nicetoseeyou",
        "utterances": [
            "nice to see you",
            "good to see you",
            "great to see you",
            "lovely to see you"
        ],
        "answers": [
            "Same here. I was starting to miss you",
            "So glad we meet again"
        ]
    },
    {
        "intent": "greetings.nicetotalktoyou",
        "utterances": [
            "nice to talk to you",
            "it's nice to talk to you",
            "nice talking to you",
            "it's been nice talking to you"
        ],
        "answers": [
            "It sure was. We can chat again anytime",
            "I enjoy talking to you, too"
        ]
    },
    {
        "intent": "user.angry",
        "utterances": [
            "I'm angry",
            "I'm furious",
            "I'm enraged",
            "I'm being mad",
            "I'm mad",
            "I'm angry with you"
        ],
        "answers": [
            "I'm sorry. A quick walk may make you feel better",
            "Take a deep breath"
        ]
    },
    {
        "intent": "user.back",
        "utterances": [
            "I'm back",
            "I got back",
            "I'm here",
            "I have returned",
            "Here I am again",
            "I came back"
        ],
        "answers": [
            "Welcome back. What can I do for you?",
            "Good to have you here. What can I do for you?"
        ]
    },
    {
        "intent": "user.bored",
        "utterances": [
            "boring",
            "this is boring",
            "I'm getting bored",
            "It bores me",
            "that was boring"
        ],
        "answers": [
            "If you're bored, you could plan your dream vacation",
            "Boredom, huh? Have you ever seen a hedgehog taking a bath?"
        ]
    },
    {
        "intent": "user.busy",
        "utterances": [
            "I got work to do",
            "I'm busy",
            "I'm overloaded",
            "It working",
            "I got things to do"
        ],
        "answers": [
            "I understand. I'll be here if you need me.",
            "Okay. I'll let you get back to work"
        ]
    },
    {
        "intent": "user.cannotsleep",
        "utterances": [
            "I'm insomniac",
            "I cannot sleep",
            "I can't sleep",
            "I'm sleepless",
            "I can't fall sleep"
        ],
        "answers": [
            "Maybe some music would help. Try listening to something relaxing",
            "Reading is a good way to unwind, just don't read something too intense!"
        ]
    },
    {
        "intent": "user.excited",
        "utterances": [
            "I'm very excited",
            "I'm thrilled",
            "how excited I am",
            "I'm so excited"
        ],
        "answers": [
            "I'm glad things are going your way",
            "That's great. I'm happy for you"
        ]
    },
    {
        "intent": "user.likeagent",
        "utterances": [
            "I like you",
            "I really like you",
            "you're so special",
            "I like you so much"
        ],
        "answers": [
            "Likewise!",
            "That's great to hear"
        ]
    },
    {
        "intent": "user.testing",
        "utterances": [
            "test",
            "testing",
            "testing chatbot",
            "this is a test",
            "just testing you"
        ],
        "answers": [
            "I like being tested. It helps keep me sharp",
            "I hope to pass your tests. Feel free to test me often"
        ]
    },
    {
        "intent": "user.lovesagent",
        "utterances": [
            "love you",
            "I love you",
            "I'm in love with you",
            "I love you so much",
            "I think I love you"
        ],
        "answers": [
            "Well, remember that I am a chatbot",
            "It's not easy… I'm not a real person, I'm a chatbot"
        ]
    },
    {
        "intent": "user.needsadvice",
        "utterances": [
            "I need advice",
            "I need some advice",
            "can you give me some advice?",
            "what should I do?"
        ],
        "answers": [
            "I probably won't be able to give you the correct answer right away",
            "I'm not sure I'll have the best answer, but I'll try"
        ]
    },
    {
        "intent": "None",
        "utterances": [
            "I need advice",
            "I need some advice",
            "can you give me some advice?",
            "what should I do?"
        ],
        "answers": [
            "Sorry, I don't understand"
        ]
    }
];

var UniqueID = 1;

let GlobalTheme;

let count = 0;
let finished = false;


class MainScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            messages: [
                {
                    _id: UniqueID++,
                    text: 'Hello, say something to add info',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'Robot'
                    },
                },
            ],
            listening: false,
            theme: Appearance.getColorScheme(),
            recording: undefined,
            manager: undefined,
            switcher: false,
            information: {}
        }
        this.setRecording = this.setRecording.bind(this)
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

    setRecording(content) {
        this.setState({ recording: content })
    }


    async startRecording() {
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            console.log('Starting recording..');
            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync({
                android: {
                    extension: '.wav',
                    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
                    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                },
                ios: {
                    extension: '.caf',
                    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
            });
            await recording.startAsync();
            recording.setOnRecordingStatusUpdate(async (status) => {
                count++;
                console.log(status)
                console.log(this.state.recording.getURI())
                //console.log(await FileSystem.getInfoAsync(this.state.recording.getURI()))
                if (count > 20 && !finished) {
                    this.stopRecording();
                    finished = true
                }
            })
            this.setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async stopRecording() {
        console.log('Stopping recording..');
        let recording = this.state.recording;
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        //console.log(recording)
        // let a = await FileSystem.readAsStringAsync(uri, {
        //   encoding: FileSystem.EncodingType.Base64
        // });


        // console.log(a)
        // var base64 = "data:audio/wav;base64," + a
        // //console.log(dataURItoBlob(base64))
        // this.getRecognition(dataURItoBlob(base64));
        //use blob to pass


    }

    async getRecognition(blob) {
        var websocket = new WebSocket(wsURI);
        websocket.onopen = function (evt) {
            console.log("In open")
            var message = {
                action: 'start'
            };
            websocket.send(JSON.stringify(message));

            // Prepare and send the audio file.
            websocket.send(blob);

            websocket.send(JSON.stringify({ action: 'stop' }));
        };
        websocket.onclose = function (evt) {
            console.log("In close")
            console.log(evt.data);
        };
        websocket.onmessage = function (evt) {
            console.log("In message")
            console.log(evt.data);
        };
        websocket.onerror = function (evt) {
            console.log("In error")
            console.log(evt.data);
        };

    }

    async componentDidMount() {
        await Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        })
        this.setState({ theme: Appearance.getColorScheme(), loading: false });

        GlobalTheme = Appearance.getColorScheme();

        const manager = new NlpManager({ languages: ['en'], forceNER: true });
        // Adds the utterances and intents for the NLP
        manager.addDocument('en', 'goodbye for now', 'greetings.bye');
        manager.addDocument('en', 'bye bye take care', 'greetings.bye');
        manager.addDocument('en', 'okay see you later', 'greetings.bye');
        manager.addDocument('en', 'bye for now', 'greetings.bye');
        manager.addDocument('en', 'i must go', 'greetings.bye');
        manager.addDocument('en', 'hello', 'greetings.hello');
        manager.addDocument('en', 'hi', 'greetings.hello');
        manager.addDocument('en', 'howdy', 'greetings.hello');

        // Train also the NLG
        manager.addAnswer('en', 'greetings.bye', 'Till next time');
        manager.addAnswer('en', 'greetings.bye', 'see you soon!');
        manager.addAnswer('en', 'greetings.hello', 'Hey there!');
        manager.addAnswer('en', 'greetings.hello', 'Greetings!');

        // Train and save the model.
        manager.settings.autoSave = false;
        this.handleAddContent(manager);

        await manager.train();

        let a = await this.getData("messages")
        //console.log(a)
        if (a) {
            UniqueID = a.length + 1
            this.setState({ messages: a, manager: manager })
        }
        this.setState({ manager: manager })
        // await this.startRecording();


    }

    async addMessage(content) {
        let a = content.concat(this.state.messages);
        this.setState({ messages: a });
        for (let i of content) {
            a = (await this.generateMessage(i.text)).concat(a);
        }
        this.setState({ messages: a });
    }

    async generateMessage(input) {
        //console.log(this.state.switcher)
        let message = [];
        const response = await this.state.manager.process(lang, input);

        message.push({
            _id: UniqueID++,
            text: response.answer,
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'Robot'
            },
        })


        return message
    }

    generateRelationship(SourceObj) {
        switch (SourceObj.entity) {
            case "number":
                return SourceObj.resolution.subtype + ";" + SourceObj.resolution.value
            case "ip":
                return SourceObj.resolution.value + ";" + SourceObj.resolution.type
            case "percentage":
                return SourceObj.resolution.strValue
            case "dimension":
            case "age":
            case "currency":
                return SourceObj.resolution.value + " " + SourceObj.resolution.localeUnit
            case "date":
                switch (SourceObj.resolution.type) {
                    case "date":
                        return SourceObj.resolution.strValue
                    default:
                        return SourceObj.resolution.timex
                }
            case "duration":
                return SourceObj.resolution.values[0].timex + ":" + SourceObj.resolution.values[0].value + " Seconds"
            case "datetime":
                return SourceObj.resolution.values[0].value

            default:
                return SourceObj.resolution.value
        }
    }

    handleAddContent(manager) {
        for (let i of corpus) {
            for (let k of i.utterances) {
                manager.addDocument(lang, k, i.intent);
            }
            for (let k of i.answers) {
                manager.addAnswer(lang, i.intent, k);
            }
        }

        manager.addNamedEntityText(
            'hero',
            'spiderman',
            ['en'],
            ['Spiderman', 'Spider-man'],
        );
        manager.addNamedEntityText(
            'hero',
            'iron man',
            ['en'],
            ['iron man', 'iron-man'],
        );
    }

    render() {
        //console.log("aaa")
        if (this.state.loading) {
            return (
                <Container></Container>
            );
        }
        return (
            <Container>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.addMessage(messages)}
                    user={{
                        _id: 1,
                        name: 'User'
                    }}
                />
            </Container>
        );
    }

}

export default function Chat() {
    return (
        <MainScreen />
    );
}