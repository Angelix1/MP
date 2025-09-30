import { before } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { General } from "@vendetta/ui/components";
import { isEnabled } from "..";


export default () => before("render", General.View, (args) => {
	if(!isEnabled) return;

    const [wrapper] = args;
    if (!wrapper || !Array.isArray(wrapper.style)) return;


	const statusColours = storage.colors || {
	    online: "#3BA55C", // green
	    idle: "#FAA81A", // yellow
	    dnd: "#ED4245", // red
	};

    const circleIdx = wrapper.style.findIndex(
        s => s &&
			s.width === 32 &&
			s.height === 32 &&
			s.borderRadius === 16
    );

    const transformIdx = wrapper.style.findIndex(
		s => s &&
			s.width === 92 &&
			s.height === 92 &&
			s.borderRadius === 92 &&
			s.padding === 6 &&
			s.zIndex === 0
	);


    if (circleIdx !== -1) {
	    // we check if this wrapper is memberlist
	    const userProps   = wrapper.children?.[1]?.props;
		const presenceProps = wrapper.children?.[3]?.props;

		// missing / wrong type → bail out
		if (!userProps?.hasOwnProperty("user") || typeof userProps.user?.id !== "string") return;
		if (!presenceProps?.hasOwnProperty("status") || typeof presenceProps.status !== "string") return;

		// console.log(userProps.user?.id, presenceProps)

		const userPresence = presenceProps.status;

		const colour = statusColours[userPresence] ?? null; // not match -> null -> no ring, means offline
		if (colour) {
			presenceProps.size = 0;
			presenceProps.isMobileOnline = false;
			presenceProps.style.display = "none";
			userProps.cutout.nativeCutouts[0].size = 0;

			const mult = storage.mult || 1.2;
			const size = storage.size || 30;

			wrapper.style[0] = { width: size * mult, height: size * mult, borderRadius: 16 * mult, overflow: "hidden" };

		    // Object.assign(wrapper.style[0], {
			wrapper.style.push({
		        borderWidth: 2.5 * mult,
		        borderColor: colour,
		        borderStyle: "solid",
		    });
		}   	
    }
    // else if(transformIdx !== -1) {
    // 	// check if this profile pfp circle, if so poke at it, currently useless
    // 	// console.log(wrapper)

	// 	const mult = 1.4;

    // 	wrapper.style.push({
	//         borderWidth: 4 * mult,
	//         borderColor: "#FAA81A",
	//         borderStyle: "solid",
	//     });
    // }

});