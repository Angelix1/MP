import { storage } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"
import { React, url } from "@vendetta/metro/common";
import { Forms, General } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets"
import { findByStoreName } from "@vendetta/metro";

const UserStore = findByStoreName("UserStore");

const { ScrollView, View, Image } = General;
const { FormArrow, FormRow, FormSection, FormDivider } = Forms;

const devs = [
	{ name: 'Angel', role: 'Author & Maintainer', uuid: "692632336961110087" }
];

const qa   = [
	{ name: 'Moodle', role: 'Quality Assurance', uuid: "807170846497570848" },
	{ name: 'Rairof', role: 'Quality Assurance', uuid: "923212189123346483" },
	{ name: 'Catinette', role: 'Quality Assurance', uuid: "1302022854740807730" },
	{ name: 'Win8.1VMUser', role: "Quality Assurance", uuid: "793935599702507542" }
];
const links = [
	{ 
		label: 'Source Code', 
		url: 'https://github.com/angelix1/MP',
	},
	{ 
		label: 'Tip via PayPal', 
		url: 'https://paypal.me/alixymizuki',
	},
	{ 
		label: 'Buy me a Ko-fi', 
		url: 'https://ko-fi.com/angel_wolf',
	},
];


export default function CreditsPage() {
	useProxy(storage)

	const open = (uri) => url.openURL(uri).catch(() => {});

	const getUser = id => UserStore?.getUser(id) || Object.values(UserStore?.getUsers()).find(u => u.id === id) || null;

	const getUserPng = id => {
		const u = getUser(id);
		return u?.getAvatarURL?.()?.replace('webp', 'png') || null
	};

	const box = u => (<Image source={{ uri: u }} style={{ width: 40, height: 40, borderRadius: 20 }} />);

	return (<>
		<ScrollView>
			<FormSection title="Developers">
				{devs.map((p, i) => {

					const avatarUri = getUserPng(p?.uuid)

					return (<FormRow
						key={i}
						label={p.name}
						subLabel={p.role}
						leading={avatarUri ? box(avatarUri) : null}
					/>)
				})}
			</FormSection>
			<FormSection title="Testers">
				{qa.map((p, i) => {

					const avatarUri = getUserPng(p?.uuid)

					return (<FormRow
						key={i}
						label={p.name}
						subLabel={p.role}
						leading={avatarUri ? box(avatarUri) : null}
					/>)
				})}
			</FormSection>
			<FormDivider />

			<FormSection title="Support & Source">
				<View style={{ margin: 50 }}>
					{links.map((l, i) => {

						let finalIcon = l.icon ? (
							l.icon?.startsWith("https") ? 
							(<Image source={{ uri: l.icon }} style={{ width: 120, height: 40 }} />) :
							(<FormRow.Icon source={getAssetIDByName(l.icon)}/>)
						) :	null;


						return (
							<FormRow
								key={i}
								label={l.label}
								leading={finalIcon}
								trailing={<FormArrow />}
								onPress={() => open(l.url)}
							/>
						)
					})}
			</View>
			</FormSection>
			<FormDivider />

			{/* extra bottom pad so last row isn’t hidden by inset */}
			<View style={{ height: 40 }} />
		</ScrollView>
	</>)
}

