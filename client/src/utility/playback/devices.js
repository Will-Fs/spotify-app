import { api } from "../../spotifyAuth";



export const getDevices = async () => {
    return api.getMyDevices().then(d => {
        const devices = d.body.devices;
        console.log(devices);
        return devices;
    })
    .catch(err => {
        console.log(err);
        return null;
    })
}

export const getActiveDevice = async () => {
    const devices = await getDevices();

    const activeDevice = devices ? devices.filter(device => device.is_active)[0] : "No active device!";
    console.log(activeDevice);
}

export const getDevice = async (id) => {
    return getDevices().then(devices => {
        const device = devices ? devices.filter(device => device.id === id)[0] : "No device found";
        return device;
    })
}

export const setActiveDevice = async (id) => {
    // const deviceName = (await getDevice(id)).name;
    return api.transferMyPlayback([id,]).catch(err => {
        const code = err.statusCode;
        if (code === 504 || code === 404)
            console.log("Device does not exist or the app is not open on the device!");
    });
}