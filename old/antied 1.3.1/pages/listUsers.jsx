import AddUser from './addUser';

import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { Forms, General } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { NavigationNative, constants, stylesheet, clipboard, React } from "@vendetta/metro/common";
import { findByName, findByProps } from "@vendetta/metro";
import { semanticColors, rawColors } from "@vendetta/ui";
import { showToast } from "@vendetta/ui/toasts";
import { showConfirmationAlert } from "@vendetta/ui/alerts";

const { ScrollView, View, Text, TouchableOpacity, TextInput } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput } = Forms;

function addIcon(i, dr) {
    return <FormIcon style={{ opacity: 1 }} source={ dr ? i : getAssetIDByName(i)} />
}

// find stuff
const useIsFocused = findByName("useIsFocused");
const { BottomSheetFlatList } = findByProps("BottomSheetScrollView");
const { getUser } = findByProps('getUser');

// Icons idk
const Add = getAssetIDByName("ic_add_24px");
const Mod = getAssetIDByName("ic_arrow");
const Remove = getAssetIDByName("ic_minus_circle_24px");
const Checkmark = getAssetIDByName("Check");
const Crossmark = getAssetIDByName("Small");
const Trash = getAssetIDByName("ic_trash_24px");

const styles = stylesheet.createThemedStyleSheet({
    basicPad: {
        paddingRight: 10,
        marginBottom: 10,
        letterSpacing: 0.25,        
    },
    header: {
        color: semanticColors.HEADER_SECONDARY,
        fontFamily: constants.Fonts.PRIMARY_BOLD,
        paddingLeft: "3.5%",
        fontSize: 24
    },
    sub: {
        color: semanticColors.TEXT_POSITIVE,
        fontFamily: constants.Fonts.DISPLAY_NORMAL,
        paddingLeft: "4%",
        fontSize: 18  
    },
    flagsText: {
        color: semanticColors.HEADER_SECONDARY,
        fontFamily: constants.Fonts.PRIMARY_BOLD,
        paddingLeft: "4%",
        fontSize: 16
    },
    input: {
      fontSize: 16,
      fontFamily: constants.Fonts.PRIMARY_MEDIUM,
      color: semanticColors.TEXT_NORMAL
    },
    placeholder: {
      color: semanticColors.INPUT_PLACEHOLDER_TEXT
    } 
});


const placeholder = 'Missing_No';

export default function ListUsers() {
    
    useProxy(storage);
    let [newUser, setNewUser] = React.useState("")

    const navigation = NavigationNative.useNavigation();
    useIsFocused();

    let users = storage?.inputs?.ignoredUserList ?? [];

    const addNewUser = () => {
        if(newUser) {
            if(!isNaN(parseInt(newUser))) {
                let validUser = getUser(newUser)

                // console.log(newUser, validUser)

                if(validUser) {
                    users.push({ id: validUser?.id, username: '', showUser: false, isWebhook: false })
                } 
                else {
                    return showToast('Invalid User Id');
                }
            }
            else {
                users.push({ id: undefined, username: newUser })
            }

            setNewUser("")
            navigation.push("VendettaCustomPage", {
                title: `Adding User to Ignore List`,
                render: () => <AddUser index={users?.length - 1} />
            })
        }
    };

    
    return (<>
        <ScrollView style={{ flex: 1 }} >
            <FormSection style={[styles.header, styles.basicPad]}>
                <View style={[styles.header, styles.sub]}>
                { users.length > 0 && (
                    <FormRow
                        label="Clear List"
                        trailing={addIcon(Trash, true)}
                        onPress={() => {
                            if (users.length !== 0) {
                                showConfirmationAlert({
                                    title: 'Hol up, wait a minute!',
                                    content: `This will removes in total ${users.length} users from ignore list.`,
                                    confirmText: 'Ye',
                                    cancelText: 'Nah',
                                    confirmColor: "brand",
                                    onConfirm: () => {
                                        storage.inputs.ignoredUserList = [];
                                        // navigation.pop()
                                    },
                                })
                            }
                        }}
                    />
                ) }
                {
                    users?.map((comp, i) => {
                        return (<>
                            <FormRow
                                label={comp?.username || comp?.id || 'No Data'}
                                trailing={<FormArrow />}
                                onPress={() => 
                                    navigation.push("VendettaCustomPage", {
                                        title: "Editing User",
                                        render: () => <AddUser index={i} />
                                    })
                                }
                            />
                        {i !== users?.length - 1 && <FormDivider />}
                        </>);
                    })
                }
                <FormRow
                    label={
                        <TextInput
                            value={newUser}
                            onChangeText={setNewUser}
                            placeholder="User ID or Username"
                            placeholderTextColor={styles.placeholder.color}
                            selectionColor={constants.Colors.PRIMARY_DARK_100}
                            onSubmitEditing={addNewUser}
                            returnKeyType="done"
                            style={styles.input}
                        />
                    }
                    trailing={
                        <TouchableOpacity 
                            onPress={addNewUser}>
                                {addIcon(Add, true)}
                        </TouchableOpacity>
                    }
                />
                </View>
            </FormSection>
        </ScrollView>  
    </>)
}

