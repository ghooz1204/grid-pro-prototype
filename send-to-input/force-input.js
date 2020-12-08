const robotjs = require('robotjs');

/*
    키보드 강제 입력
*/

module.exports = {
    /* Keyboard */
    customDials: function (value, left, right) {
        /* Dial */
        // 다이얼에서 강제입력 할 수 있도록 증가, 감소 사용
        if (value < 0) {
            this.combineKeysTap(left.keys, left.modifiers, value);
        } else {
            this.combineKeysTap(right.keys, right.modifiers, value);
        }
    },
    combineKeysTap: function (keys, modifiers) {
        /* Button */
        // 일반 키 조합 연속 입력
        if (keys.length > 0) {
            const mod = modifiers ? modifiers : [];
            robotjs.keyToggle(keys[0], 'down', mod);
            this.combineKeysTap(keys.slice(1, keys.length), modifiers);
            robotjs.keyToggle(keys[0], 'up', mod);
        }
    },
    combineKeysToggle: function (keys, state, modifiers) {
        /* Button */
        // 일반 키 조합 연속 누르거나 떼기
        if (keys.length > 0) {
            const mod = modifiers ? modifiers : [];
            robotjs.keyToggle(keys[0], state, mod);
            this.combineKeysToggle(
                keys.slice(1, keys.length),
                state,
                modifiers,
            );
        }
    },
};
