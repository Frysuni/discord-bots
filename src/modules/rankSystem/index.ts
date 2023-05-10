export async function execute() { null; }


export function calculateExpForLvl(level: number) {
    if (level == 1) return 0;
    level -= 2;
    return 7 * Math.pow(level, 2) + 60 * level + 100;
    /*
    ┌─────────┬──────┬────────┐
    │ (index) │ need │ toNext │
    ├─────────┼──────┼────────┤
    │    1    │  0   │  100   │
    │    2    │ 100  │   67   │
    │    3    │ 167  │   81   │
    │    4    │ 248  │   95   │
    │    5    │ 343  │  109   │
    │    6    │ 452  │  123   │
    │    7    │ 575  │  137   │
    │    8    │ 712  │  151   │
    │    9    │ 863  │  165   │
    │   10    │ 1028 │  179   │
    └─────────┴──────┴────────┘
    */
}
