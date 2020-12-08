/* Node.js Module */
const forceInput = require('./force-input');
const cep = require('./cep');
// Main-process module

function transformExcuteFromProperty(property, s) {
    /*
        입력받은 N번째 다이얼 / 버튼에 지정되어 있는 기능을
        실제로 실행하는 부분.

        실행할 데이터가 담긴 property의 etype을 통해 그에 맞는
        강제입력 / cep로 구분하고 폼을 맞춰 실행하는 함수.

        매개변수 :
            property = 실행할 데이터(etype, fcode)
            s = 다이얼의 경우 필요한 가속도 상수(speed) || 버튼의 경우 up / down 여부(state)
        반환 값 :
    */
    const { etype, fcode } = property; // property로 부터 etype, fcode를 추출
    const {
        messageType,
        actionType,
        typeKey, // cep 사용시 필요한 데이터
        keys,
        modifiers,
        rotate,
    } = fcode; // fcode로 부터 각각 필요한 데이터들 출력
    switch (etype) {
        case 'sendCepScript': // CEP 실행
            return s
                ? cep.sendCepScript(
                      messageType,
                      actionType,
                      typeKey,
                      s,
                      'Photoshop',
                  )
                : null;
        case 'sendKeyboards': // 강제 입력(키보드 조합) 버튼 실행
            forceInput.combineKeysToggle(keys, s ? 'down' : 'up', modifiers);
            break;
        case 'sendDialKeyboards': // 강제 입력(키보드 조합) 다이얼 실행
            forceInput.customDials(s, rotate.left, rotate.right);
            break;
        default:
            break;
    }
}

function getCurrentProperty(isDial, index) {
    if (isDial) {
        const property = [
            // 상단 작은 다이얼
            {
                fname: '명도/대비 (명도)',
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'adjustmentLayer',
                    actionType: 'adjustmentLayerAdjust',
                    typeKey: 'adjustBrightness',
                },
            },
            {
                fname: '명도/대비 (대비)',
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'adjustmentLayer',
                    actionType: 'adjustmentLayerAdjust',
                    typeKey: 'adjustContrast',
                },
            },
            {
                fname: '노출 (노출)',
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'adjustmentLayer',
                    actionType: 'adjustmentLayerAdjust',
                    typeKey: 'adjustExposure',
                },
            },
            {
                fname: '색조/채도 (채도)',
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'adjustmentLayer',
                    actionType: 'adjustmentLayerAdjust',
                    typeKey: 'adjustSaturation',
                },
            },
            {
                fname: '색조/채도 (색조)',
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'adjustmentLayer',
                    actionType: 'adjustmentLayerAdjust',
                    typeKey: 'adjustHue',
                },
            },
            {
                fname: '활기 (활기)',
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'adjustmentLayer',
                    actionType: 'adjustmentLayerAdjust',
                    typeKey: 'adjustVibrance',
                },
            }, // 상단 작은 다이얼
            // 좌측 중간 다이얼
            {
                fname: '브러쉬 모드',
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'adjustment',
                    actionType: 'modifyBrushMode',
                    typeKey: '',
                },
            },
            {
                fname: '브러쉬 경도',
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'adjustment',
                    actionType: 'modifyBrushHardness',
                    typeKey: '',
                },
            },
            {
                fname: '브러쉬 불투명도',
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'adjustment',
                    actionType: 'modifyBrushOpacity',
                    typeKey: '',
                },
            }, // 좌측 중간 다이얼
            // 큰 다이얼
            {
                fname: '브러쉬 사이즈',
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'adjustment',
                    actionType: 'modifyBrushSize',
                    typeKey: '',
                },
            }, // 큰 다이얼
        ];
        return property[index];
    } else {
        const property = [
            // 첫 번째 라인
            {
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'command',
                    actionType: 'setTool',
                    typeKey: 'lassoTool',
                },
            },
            {
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'command',
                    actionType: 'setTool',
                    typeKey: 'polySelTool',
                },
            },
            {
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'command',
                    actionType: 'setTool',
                    typeKey: 'magneticLassoTool',
                },
            },
            {
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'command',
                    actionType: 'setTool',
                    typeKey: 'quickSelectTool',
                },
            },
            {
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'command',
                    actionType: 'setTool',
                    typeKey: 'magicWandTool',
                },
            }, // 첫 번째 라인
            // 두 번째 라인
            {
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'command',
                    actionType: 'createLayer',
                    typeKey: '',
                },
            },
            {
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'command',
                    actionType: 'deleteLayer',
                    typeKey: '',
                },
            },
            {
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'command',
                    actionType: 'mergeDown',
                    typeKey: '',
                },
            },
            {
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'command',
                    actionType: 'groupLayers',
                    typeKey: '',
                },
            },
            {
                etype: 'sendKeyboards',
                fcode: {
                    keys: ['g'],
                    modifiers: ['control', 'shift'],
                },
            }, // 두 번째 라인
            // 세 번째 라인
            {
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'command',
                    actionType: 'setTool',
                    typeKey: 'paintbrushTool',
                },
            },
            {
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'command',
                    actionType: 'setTool',
                    typeKey: 'eraserTool',
                },
            },
            {
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'command',
                    actionType: 'setTool',
                    typeKey: 'handTool',
                },
            },
            {
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'command',
                    actionType: 'setTool',
                    typeKey: 'moveTool',
                },
            },
            {
                etype: 'sendCepScript',
                fcode: {
                    messageType: 'command',
                    actionType: 'setTool',
                    typeKey: 'eyedropperTool',
                },
            }, // 세 번째 라인
            // 네 번째 라인
            {
                etype: 'sendKeyboards',
                fcode: {
                    keys: [],
                    modifiers: ['shift'],
                },
            },
            {
                etype: 'sendKeyboards',
                fcode: {
                    keys: ['z'],
                    modifiers: ['control'],
                },
            },
            {
                etype: 'sendKeyboards',
                fcode: {
                    keys: ['z'],
                    modifiers: ['control', 'shift'],
                },
            },
            {
                etype: 'sendKeyboards',
                fcode: {
                    keys: ['c'],
                    modifiers: ['control'],
                },
            },
            {
                etype: 'sendKeyboards',
                fcode: {
                    keys: ['v'],
                    modifiers: ['control'],
                },
            }, // 네 번째 라인
            // 다섯 번째 라인
            {
                etype: 'sendKeyboards',
                fcode: {
                    keys: [],
                    modifiers: ['control'],
                },
            },
            {
                etype: 'sendKeyboards',
                fcode: {
                    keys: ['fn'],
                    modifiers: [],
                },
            },
            {
                etype: 'sendKeyboards',
                fcode: {
                    keys: [],
                    modifiers: ['alt'],
                },
            },
            {
                etype: 'sendKeyboards',
                fcode: {
                    keys: ['space'],
                    modifiers: [],
                },
            },
            {
                etype: 'sendKeyboards',
                fcode: {
                    keys: ['enter'],
                    modifiers: [],
                },
            }, // 다섯 번째 라인
            // 방향키
            {
                etype: 'sendKeyboards',
                fcode: {
                    keys: ['left'],
                    modifiers: [],
                },
            },
            {
                etype: 'sendKeyboards',
                fcode: {
                    keys: ['down'],
                    modifiers: [],
                },
            },
            {
                etype: 'sendKeyboards',
                fcode: {
                    keys: ['right'],
                    modifiers: [],
                },
            },
            {
                etype: 'sendKeyboards',
                fcode: {
                    keys: ['up'],
                    modifiers: [],
                },
            }, // 방향키
            // 우측 상단 3개
            {
                etype: 'sendKeyboards',
                fcode: {
                    keys: ['backspace'],
                    modifiers: [],
                },
            },
            {
                etype: 'sendKeyboards',
                fcode: {
                    keys: ['delete'],
                    modifiers: [],
                },
            },
            {
                etype: 'sendKeyboards',
                fcode: {
                    keys: ['s'],
                    modifiers: ['control'],
                },
            }, // 우측 상단 3개
        ];
        return property[index];
    }
}

function sendCurrentFuntion(isDial, index, s) {
    const property = getCurrentProperty(isDial, index);
    if (property) {
        transformExcuteFromProperty(property, s);
    }
}

module.exports = {
    sendCurrentFuntion,
};
