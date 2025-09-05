import {userRecipient} from '@/app/typemodule';

export const randomizeEmailIndex = (array:userRecipient[]):userRecipient[] => {
    const arr = [...array]; // copy
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}