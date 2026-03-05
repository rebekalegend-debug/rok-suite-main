// Alliance tag → display abbreviation
const ALLIANCE_DISPLAY_NAMES: Record<string, string> = {
    '37NL': '37NL',
};

export function allianceDisplay(tag: string | null): string {
    return tag ? (ALLIANCE_DISPLAY_NAMES[tag] || tag) : '-';
}
