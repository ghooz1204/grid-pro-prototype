const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
// Node.js module

const { sendCurrentFuntion } = require('./send-to-input');
// Main-process module

const dialState = ['0', '0', '0', '0', '0', '0'];
const buttonState = [
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
];
// 상수 정의

const getRotateVectorFromBuffer = (r, v) => (v === 1 ? r : -r);
function getSignalFromBuffer(buffer) {
    const bfSplit = buffer.split(',');
    if (bfSplit[0] === '$0') {
        for (let dNum = 0; dNum < 10; dNum++) {
            const checkNum = dNum * 3;
            if (
                parseInt(bfSplit[checkNum + 2]) &&
                (dNum >= 6 || dialState[dNum] === bfSplit[checkNum + 3])
            ) {
                const value = getRotateVectorFromBuffer(
                    parseInt(bfSplit[checkNum + 2]), // 가속도
                    parseInt(bfSplit[checkNum + 3]), // 방향
                );
                // 방향을 분석하여 value에 음수, 양수를 부여함.
                sendCurrentFuntion(true, dNum, value); // 다이얼 기능을 실행함
            }
            if (dNum < 6 && bfSplit[checkNum + 3] !== '0')
                dialState[dNum] = bfSplit[checkNum + 3]; // 마지막 방향의 상태를 저장해둠
        }
    } else if (bfSplit[0] === '$1') {
        for (let bNum = 0; bNum < 32; bNum++) {
            if (bfSplit[bNum + 1] !== buttonState[bNum]) {
                sendCurrentFuntion(false, bNum, bfSplit[bNum + 1] === '1');
            }
            buttonState[bNum] = bfSplit[bNum + 1];
        }
    }
}

async function findDevice() {
    const ports = await SerialPort.list();
    const paths = [];
    for (const port of ports) {
        if (port.vendorId === '0483' || port.path.indexOf('INVAIZ') !== -1) {
            paths.push(port.path);
        }
    }
    if (paths.length) return paths;
    throw new Error('No arduinos found');
}

function connectDevice(devices) {
    devices.forEach((devicePath) => {
        const device = new SerialPort(devicePath, {
            dataBits: 8,
            baudRate: 115200,
        });
        device.on('open', () => {
            device.set({ rts: false, dtr: false }, (err) => {});
            const parser = new Readline(); // 버퍼 데이터를 파싱할 파서

            device.pipe(parser); // 연결된 디바이스에 파서를 연결함.
            parser.on('data', (line) => {
                // 파서로부터 데이터가 들어올 때 마다
                const l = typeof line === 'string' ? line : line.toString();
                getSignalFromBuffer(l); // 그 데이터를 분석하여 기능 실행
            });
        });
    });
}

setTimeout(() => {
    findDevice().then(connectDevice);
}, 1000);
