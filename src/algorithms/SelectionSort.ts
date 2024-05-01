import { PRIMARY_COLOR, SECONDARY_COLOR, SORTED_COLOR } from "../components/SortingVisualizer/SortingVisualizer";
import { Animation } from "../interfaces/Animation";

export function getSelectionSortAnimations(array: number[]): Animation[] {
    const animations: Animation[] = [];
    selectionSortHelper(array, animations);
    return animations;
}

function selectionSortHelper(array: number[], animations: Animation[]) {
    for (let i = 0; i < array.length - 1; i++) {
        let index = i;
        animations.push({ num1: i, num2: i, color: SECONDARY_COLOR });
        for (let j = i + 1; j < array.length; j++) {

            animations.push({ num1: j, num2: j, color: SECONDARY_COLOR });
            if (array[j] <= array[index]) {
                index = j;
            }
            animations.push({ num1: j, num2: j, color: PRIMARY_COLOR });

        }
        animations.push({ num1: i, num2: i, color: PRIMARY_COLOR });


        // Found the least number index.
        const temp = array[i];

        animations.push({ num1: i, num2: array[index] });
        animations.push({ num1: index, num2: temp });

        array[i] = array[index];
        array[index] = temp;
        animations.push({ num1: i, num2: i, color: SORTED_COLOR });
    }
    animations.push({ num1: array.length - 1, num2: array.length - 1, color: SORTED_COLOR });

}
