export default class PointWithIndex extends google.maps.Data.Point {
    pointIdx: number;
    // x: number;
    // y: number;

    constructor(
        latLng: google.maps.LatLng | google.maps.LatLngLiteral,
        pointIdx: number,
    ) {
        // this.x = x;
        // this.y = y;
        super(latLng);
        this.pointIdx = pointIdx;
    }
    // equals (other: google.maps.Point | null): boolean {
    //     return other !== null && this.x === other.x && this.y === other.y;
    // }
    // toString (): string {
    //     return `[${this.x}, ${this.y})`;
    // }
}
