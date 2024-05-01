import { PRIMARY_COLOR, SECONDARY_COLOR } from "../components/SortingVisualizer/SortingVisualizer";
import { Animation } from "../interfaces/Animation";

export function getMergeSortAnimations(array: number[]): Animation[] {
    const animations: Animation[] = [];
    if (array.length <= 1) return [];
    const auxiliaryArray = array.slice();
    mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
    return animations;
}

function mergeSortHelper(
    mainArray: number[],
    startIdx: number,
    endIdx: number,
    auxiliaryArray: number[],
    animations: Animation[],
) {
    if (startIdx === endIdx) return;
    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
    mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
    doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(
    mainArray: number[],
    startIdx: number,
    middleIdx: number,
    endIdx: number,
    auxiliaryArray: number[],
    animations: Animation[],
) {
    let k = startIdx;
    let i = startIdx;
    let j = middleIdx + 1;
    while (i <= middleIdx && j <= endIdx) {
        animations.push({ num1: i, num2: j, color: SECONDARY_COLOR });
        if (auxiliaryArray[i] <= auxiliaryArray[j]) {
            animations.push({ num1: k, num2: auxiliaryArray[i] });
            animations.push({ num1: i, num2: j, color: PRIMARY_COLOR });
            mainArray[k++] = auxiliaryArray[i++];
        } else {
            animations.push({ num1: k, num2: auxiliaryArray[j] });
            animations.push({ num1: i, num2: j, color: PRIMARY_COLOR });
            mainArray[k++] = auxiliaryArray[j++];
        }
    }
    while (i <= middleIdx) {
        animations.push({ num1: i, num2: i, color: SECONDARY_COLOR });
        animations.push({ num1: k, num2: auxiliaryArray[i] });
        animations.push({ num1: i, num2: i, color: PRIMARY_COLOR });
        mainArray[k++] = auxiliaryArray[i++];
    }
    while (j <= endIdx) {
        animations.push({ num1: j, num2: j, color: SECONDARY_COLOR });
        animations.push({ num1: k, num2: auxiliaryArray[j] })
        animations.push({ num1: j, num2: j, color: PRIMARY_COLOR });
        mainArray[k++] = auxiliaryArray[j++];
    }
}
