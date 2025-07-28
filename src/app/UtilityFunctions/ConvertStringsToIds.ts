export function ArrayToMapConvertor(stringToIdMap: Array<{ name: string, id: number }>): any {
    const NameToIdMap = new Map<string, number>();
    const IdToNameMap = new Map<number, string>();

    stringToIdMap.forEach(item => {
        NameToIdMap.set(item.name, item.id);
    });
    stringToIdMap.forEach(item => {
        IdToNameMap.set(item.id, item.name);
    });
    return [NameToIdMap, IdToNameMap];
}

export function ConvertNameToIds(stringIdMap: Map<string, number>, data: string): any {
    if (!data || !stringIdMap) {
        return undefined;
    }

    const output = data.split(',').map((name: string) => {
        const trimmedItem = name.trim();
        return stringIdMap.has(trimmedItem) ? stringIdMap.get(trimmedItem) : null;
    }).filter(id => id !== null);

    // console.log(`Input string: ${data}`);
    // console.log(`Converted string to IDs: ${output}`);

    return output ? output : undefined;
}

export function ConvertIdsToName(stringIdMap: Map<string, number>, data: string): any {
    if (!data || !stringIdMap) {
        return undefined;
    }

    let output = data.split(',').map((item: string) => {
        const trimmedItem = item.trim();
        return stringIdMap.has(trimmedItem) ? stringIdMap.get(trimmedItem) : null;
    }).filter(name => name !== null).join(',');

    // console.log(`Input string: ${data}`);
    // console.log(`Converted string to IDs: ${output}`);

    return output ? output : undefined;
}